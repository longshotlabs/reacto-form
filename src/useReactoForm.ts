import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import set from 'lodash/set'
import { useEffect, useState } from 'react'
import rfdc from 'rfdc'

import {
  ErrorOptions,
  FormData,
  InputPropNameMap,
  OnSubmitResult,
  UseReactoFormProps,
  UseReactoFormState,
  ValidationError
} from './types'
import bracketsToDots from './util/bracketsToDots'
import filterErrorsForNames from './util/filterErrorsForNames'

// https://github.com/davidmarkclements/rfdc#api
const clone = rfdc()

const DEFAULT_PROP_NAMES: InputPropNameMap = {
  errors: 'errors',
  hasBeenValidated: 'hasBeenValidated',
  isReadOnly: 'isReadOnly',
  name: 'name',
  onChange: 'onChange',
  onChanging: 'onChanging',
  onSubmit: 'onSubmit',
  value: 'value'
}

/**
 * @summary To ensure we do not mutate objects passed in, we'll do a deep clone.
 * @param value Any value
 * @return Cloned value
 */
function cloneValue (value: any): any {
  return value != null ? clone(value) : {}
}

/**
 * @summary Main ReactoForm hook
 */
export default function useReactoForm (props: UseReactoFormProps): UseReactoFormState {
  const {
    hasBeenValidated: hasBeenValidatedProp,
    logErrorsOnSubmit = false,
    onChange = () => {},
    onChanging = () => {},
    onSubmit = () => ({ ok: true }),
    revalidateOn = 'changing',
    shouldSubmitWhenInvalid = false,
    validateOn = 'submit',
    validator,
    value: valueProp
  } = props

  const [errors, setErrors] = useState<ValidationError[]>([])
  const [hasBeenValidated, setHasBeenValidated] = useState(
    hasBeenValidatedProp ?? false
  )
  const [forceReset, setForceReset] = useState(0)
  const [formData, setFormData] = useState<FormData>({})

  // isReadOnly can be passed as a function, which is then called with
  // the current form data to determine whether it should be read only.
  let { isReadOnly } = props
  if (typeof isReadOnly === 'function') {
    isReadOnly = !!isReadOnly(formData)
  }

  /**
   * @summary Set field value in state using lodash set
   * @return A copy of formData, mutated
   */
  function setFieldValueInFormData (fieldPath: string, fieldValue: any): FormData {
    const formDataCopy = clone(formData)
    set(formDataCopy, fieldPath, fieldValue === undefined ? null : fieldValue)
    setFormData(formDataCopy)
    return formDataCopy
  }

  // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
  useEffect(() => {
    setErrors([])
    setHasBeenValidated(false)
    setFormData(cloneValue(valueProp))
  }, [JSON.stringify(valueProp), forceReset])

  // Let props override the `hasBeenValidated` state
  useEffect(() => {
    if (
      typeof hasBeenValidatedProp === 'boolean' &&
      hasBeenValidatedProp !== hasBeenValidated
    ) {
      setHasBeenValidated(hasBeenValidatedProp)
    }
  }, [hasBeenValidatedProp])

  /**
   * @summary Validate the form
   * @return {Promise<Object[]>} Promised array of error objects
   */
  async function validateForm (): Promise<ValidationError[]> {
    if (typeof validator !== 'function') return []

    let customValidatorErrors
    try {
      customValidatorErrors = await validator(formData)
    } catch (error) {
      console.error(error)
      return []
    }

    if (!Array.isArray(customValidatorErrors)) {
      console.error('validator function must return or promise an array')
      return []
    }

    setErrors(customValidatorErrors)
    setHasBeenValidated(true)

    return customValidatorErrors
  }

  /**
   *
   */
  async function submitForm (): Promise<null> {
    const validationErrors = await validateForm()

    if (logErrorsOnSubmit && validationErrors.length > 0) { console.error(validationErrors) }

    if ((validationErrors.length > 0) && !shouldSubmitWhenInvalid) return null

    // onSubmit should ideally return a Promise so that we can wait
    // for submission to complete, but we won't worry about it if it doesn't
    let submissionResult: OnSubmitResult
    try {
      submissionResult = await onSubmit(
        formData,
        validationErrors.length === 0
      )
    } catch (error) {
      console.error('Form "onSubmit" function error:', error)
      return null
    }

    const { ok = true, errors: submissionErrors = null } = (submissionResult != null) ? submissionResult : {}

    // Submission result must be an object with `ok` bool prop
    // and optional submission errors
    if (ok) {
      // Because `valueProp` is sometimes stale in this function, we have to
      // force a reset this way rather than by calling `setFormData` directly
      setForceReset(forceReset + 1)
      return null
    }

    if (submissionErrors != null) {
      if (Array.isArray(submissionErrors)) {
        setErrors(submissionErrors)
      } else {
        console.error(
          'onSubmit returned an object with "errors" property that is not a valid errors array'
        )
      }
    }

    return null
  }

  function getErrors (fieldPaths: string[], options: ErrorOptions = {}): ValidationError[] {
    if (!Array.isArray(fieldPaths)) {
      throw new Error(
        'First argument to getErrors must be an array of field paths'
      )
    }

    const { includeDescendantErrors = false } = options
    return filterErrorsForNames(errors, fieldPaths, !includeDescendantErrors)
  }

  function getFirstError (fieldPaths: string[], options?: ErrorOptions): ValidationError | null {
    const fieldErrors = getErrors(fieldPaths, options)
    if (fieldErrors.length === 0) return null
    return fieldErrors[0]
  }

  function applyValueChange (updatedFormData: FormData, isValidationRequired = false) {
    // Bubble up the `onChange`, possibly validating first
    if (isValidationRequired) {
      validateForm()
        .then((updatedErrors) => {
          onChange(updatedFormData, updatedErrors.length === 0)
          return null
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      onChange(updatedFormData, errors.length === 0)
    }
  }

  const formState: UseReactoFormState = {
    formData,
    updateFormData (formData) {
      const isValidationRequired =
        validateOn === 'changed' ||
        validateOn === 'changing' ||
        (hasBeenValidated &&
          (revalidateOn === 'changed' || revalidateOn === 'changing'))

      applyValueChange(formData, isValidationRequired);
    },
    getInputProps (fieldPath, getInputPropsOptions = {}) {
      const {
        isForm = false,
        nullValue,
        onChangeGetValue,
        onChangingGetValue,
        onApplyChangeToForm,
      } = getInputPropsOptions

      const propNames: InputPropNameMap = { ...DEFAULT_PROP_NAMES }
      if (getInputPropsOptions.propNames != null) {
        for (const key in getInputPropsOptions.propNames) {
          if (Object.prototype.hasOwnProperty.call(getInputPropsOptions.propNames, key)) {
            const customPropName = getInputPropsOptions.propNames[key]
            if (customPropName !== undefined) {
              propNames[key] = customPropName
            }
          }
        }
      }

      let fieldErrors = filterErrorsForNames(errors, [fieldPath], false)

      // Adjust the error names to correct scope for forms
      if (isForm) {
        const canonicalName = bracketsToDots(fieldPath)
        fieldErrors = fieldErrors.map((err) => ({
          ...err,
          name: bracketsToDots(err.name).slice(canonicalName.length + 1)
        }))
      }

      function onInputValueChange (...onChangeArgs: any[]): void {
        // The composable forms spec calls for new value to be passed
        // directly as the first arg. Many popular libraries pass
        // an Event as the first arg, and `onChangeGetValue` can be
        // used to determine and return the new value.
        const inputValue = (onChangeGetValue != null)
          ? onChangeGetValue(...onChangeArgs)
          : onChangeArgs[0]

        const updatedFormData = (onApplyChangeToForm != null)
          ? onApplyChangeToForm(clone(formData), inputValue, fieldPath)
          : setFieldValueInFormData(fieldPath, inputValue)

        const isValidationRequired =
          validateOn === 'changed' ||
          validateOn === 'changing' ||
          (hasBeenValidated &&
            (revalidateOn === 'changed' || revalidateOn === 'changing'))

        applyValueChange(updatedFormData, isValidationRequired)
      }

      function onInputValueChanging (...onChangingArgs: any[]): void {
        // The composable forms spec calls for new value to be passed
        // directly as the first arg. Many popular libraries pass
        // an Event as the first arg, and `onChangeGetValue` can be
        // used to determine and return the new value.
        const inputValue = (onChangingGetValue != null)
          ? onChangingGetValue(...onChangingArgs)
          : onChangingArgs[0]

        const updatedFormData = setFieldValueInFormData(fieldPath, inputValue)

        const isValidationRequired =
          validateOn === 'changing' ||
          (hasBeenValidated && revalidateOn === 'changing')

        applyValueChange(updatedFormData, isValidationRequired)
      }

      // Some input components (MUI) do not accept a `null` value.
      // For these, passing `{ nullValue: "" }` options does the trick.
      let value = get(formData, fieldPath, null)
      if (value === null && nullValue !== undefined) value = nullValue

      const inputProps: Record<string, any> = {}
      if (propNames.errors !== false) inputProps[propNames.errors] = fieldErrors
      if (propNames.hasBeenValidated !== false) inputProps[propNames.hasBeenValidated] = hasBeenValidated
      if (propNames.isReadOnly !== false) inputProps[propNames.isReadOnly] = isReadOnly
      if (propNames.name !== false) inputProps[propNames.name] = fieldPath
      if (propNames.onChange !== false) inputProps[propNames.onChange] = onInputValueChange
      if (propNames.onChanging !== false) inputProps[propNames.onChanging] = onInputValueChanging
      if (propNames.onSubmit !== false) inputProps[propNames.onSubmit] = submitForm
      if (propNames.value !== false) inputProps[propNames.value] = value

      return inputProps
    },
    getErrors,
    getFirstError,
    getFirstErrorMessage (fieldPaths, options) {
      const fieldError = getFirstError(fieldPaths, options)
      return fieldError != null ? fieldError.message : null
    },
    hasBeenValidated,
    hasErrors (fieldPaths, options) {
      return getErrors(fieldPaths, options).length > 0
    },
    // Form is dirty if value prop doesn't match value state. Whenever a changed
    // value prop comes in, we reset state to that, thus becoming clean.
    isDirty: !isEqual(formData, valueProp),
    resetValue () {
      // Because `valueProp` is sometimes stale in this function, we have to
      // force a reset this way rather than by calling `setFormData` directly
      setForceReset(forceReset + 1)
    },
    submitForm
  }

  return formState
}
