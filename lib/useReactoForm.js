import { useEffect, useState } from 'react';
import clone from 'clone';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import unset from 'lodash/unset';
import bracketsToDots from './shared/bracketsToDots';
import filterErrorsForNames from './shared/filterErrorsForNames';

/**
 * @summary To ensure we do not mutate objects passed in, we'll do a deep clone.
 * @param {Any} value Any value
 * @return {Object} Cloned value
 */
function cloneValue(value) {
  return value ? clone(value) : {};
}

/**
 * @summary Main ReactoForm hook
 */
export default function useReactoForm(props) {
  const {
    hasBeenValidated: hasBeenValidatedProp,
    isReadOnly,
    logErrorsOnSubmit = false,
    onChange = () => {},
    onChanging = () => {},
    onSubmit = () => {},
    revalidateOn = 'changing',
    shouldSubmitWhenInvalid = false,
    validateOn = 'submit',
    validator,
    value: valueProp,
  } = props;

  const [errors, setErrors] = useState([]);
  const [hasBeenValidated, setHasBeenValidated] = useState(hasBeenValidatedProp || false);
  const [formData, setFormData] = useState(cloneValue(valueProp));

  /**
   * @summary Reset state
   * @return {undefined}
   */
  function resetValue() {
    setErrors([]);
    setHasBeenValidated(false);
    setFormData(cloneValue(valueProp));
  }

  // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
  useEffect(resetValue, [valueProp]);

  // Let props override the `hasBeenValidated` state
  useEffect(() => {
    if (typeof hasBeenValidatedProp === 'boolean' && hasBeenValidatedProp !== hasBeenValidated) {
      setHasBeenValidated(hasBeenValidatedProp);
    }
  }, [hasBeenValidatedProp]);

  /**
   * @summary Validate the form
   * @return {Promise<Object[]>} Promised array of error objects
   */
  async function validateForm() {
    if (typeof validator !== 'function') return [];

    let customValidatorErrors;
    try {
      customValidatorErrors = await validator(formData);
    } catch (error) {
      console.error(error);
      return [];
    }

    if (!Array.isArray(customValidatorErrors)) {
      console.error('validator function must return a Promise that resolves with an array');
      return [];
    }

    setErrors(customValidatorErrors);
    setHasBeenValidated(true);

    return customValidatorErrors;
  }

  /**
   *
   */
  async function submitForm() {
    let validationErrors;
    try {
      validationErrors = await validateForm();
    } catch (error) {
      console.error('Form "validate" function error:', error);
      return null;
    }

    if (!Array.isArray(validationErrors)) {
      console.error('Form "validate" function resolved with non-array');
      return null;
    }

    if (logErrorsOnSubmit && validationErrors.length > 0) console.error(validationErrors);

    if (validationErrors.length && !shouldSubmitWhenInvalid) return null;

    // onSubmit should ideally return a Promise so that we can wait
    // for submission to complete, but we won't worry about it if it doesn't
    let submissionResult;
    try {
      submissionResult = await onSubmit(formData, validationErrors.length === 0);
    } catch (error) {
      console.error('Form "onSubmit" function error:', error);
      return null;
    }

    const { ok = true, errors: submissionErrors } = submissionResult || {};

    // Submission result must be an object with `ok` bool prop
    // and optional submission errors
    if (ok) {
      resetValue();
      return null;
    }

    if (submissionErrors) {
      if (Array.isArray(submissionErrors)) {
        setErrors(submissionErrors);
      } else {
        console.error('onSubmit returned a value that is not an errors array');
      }
    }

    return null;
  }

  return {
    formData,
    getInputProps(fieldPath, isForm) {
      let fieldErrors = filterErrorsForNames(errors, [fieldPath], false);

      // Adjust the error names to correct scope for forms
      if (isForm) {
        const canonicalName = bracketsToDots(fieldPath);
        fieldErrors = fieldErrors.map(err => ({
          ...err,
          name: bracketsToDots(err.name).slice(canonicalName.length + 1),
        }));
      }

      return {
        errors: fieldErrors,
        onChange(inputValue) {
          // Since we clone the object whenever we set state from props, we can directly
          // set the prop rather than copying the whole object.
          if (inputValue === undefined) {
            unset(formData, fieldPath);
          } else {
            set(formData, fieldPath, inputValue);
          }
          setFormData(formData);

          // Now bubble up the `onChange`, possibly validating first
          if (
            validateOn === 'changed'
            || validateOn === 'changing'
            || (
              hasBeenValidated
              && (revalidateOn === 'changed' || revalidateOn === 'changing')
            )
          ) {
            validateForm()
              .then((updatedErrors) => {
                onChange(formData, updatedErrors.length === 0);
                return null;
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            onChange(formData, errors.length === 0);
          }
        },
        onChanging(inputValue) {
          // Since we clone the object whenever we set state from props, we can directly
          // set the prop rather than copying the whole object.
          if (inputValue === undefined) {
            unset(formData, fieldPath);
          } else {
            set(formData, fieldPath, inputValue);
          }
          setFormData(formData);

          if (
            validateOn === 'changing'
            || (hasBeenValidated && revalidateOn === 'changing')
          ) {
            validateForm()
              .then((updatedErrors) => {
                onChanging(formData, updatedErrors.length === 0);
                return null;
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            onChanging(formData, errors.length === 0);
          }
        },
        onSubmit: submitForm,
        value: get(formData, fieldPath),
      };
    },
    getErrors(names, exact) {
      return filterErrorsForNames(errors, names, exact);
    },
    hasBeenValidated,
    // Form is dirty if value prop doesn't match value state. Whenever a changed
    // value prop comes in, we reset state to that, thus becoming clean.
    isDirty: !isEqual(formData, valueProp),
    isReadOnly,
    submitForm,
  };
}
