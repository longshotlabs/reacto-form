import { useEffect, useState } from "react";
import clone from "clone";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import set from "lodash/set";
import bracketsToDots from "./shared/bracketsToDots";
import filterErrorsForNames from "./shared/filterErrorsForNames";

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
    logErrorsOnSubmit = false,
    onChange = () => {},
    onChanging = () => {},
    onSubmit = () => {},
    revalidateOn = "changing",
    shouldSubmitWhenInvalid = false,
    validateOn = "submit",
    validator,
    value: valueProp,
  } = props;

  const [errors, setErrors] = useState([]);
  const [hasBeenValidated, setHasBeenValidated] = useState(
    hasBeenValidatedProp || false
  );
  const [forceReset, setForceReset] = useState(0);
  const [formData, setFormData] = useState({});

  // isReadOnly can be passed as a function, which is then called with
  // the current form data to determine whether it should be read only.
  let { isReadOnly } = props;
  if (typeof isReadOnly === "function") {
    isReadOnly = !!isReadOnly(formData);
  }

  /**
   * @summary Set field value in state using lodash set
   * @return {Object} A copy of formData, mutated
   */
  function setFieldValueInFormData(fieldPath, fieldValue) {
    const formDataCopy = clone(formData);
    set(formDataCopy, fieldPath, fieldValue === undefined ? null : fieldValue);
    setFormData(formDataCopy);
    return formDataCopy;
  }

  // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
  useEffect(() => {
    setErrors([]);
    setHasBeenValidated(false);
    setFormData(cloneValue(valueProp));
  }, [valueProp, forceReset]);

  // Let props override the `hasBeenValidated` state
  useEffect(() => {
    if (
      typeof hasBeenValidatedProp === "boolean" &&
      hasBeenValidatedProp !== hasBeenValidated
    ) {
      setHasBeenValidated(hasBeenValidatedProp);
    }
  }, [hasBeenValidatedProp]);

  /**
   * @summary Validate the form
   * @return {Promise<Object[]>} Promised array of error objects
   */
  async function validateForm() {
    if (typeof validator !== "function") return [];

    let customValidatorErrors;
    try {
      customValidatorErrors = await validator(formData);
    } catch (error) {
      console.error(error);
      return [];
    }

    if (!Array.isArray(customValidatorErrors)) {
      console.error("validator function must return or promise an array");
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
    const validationErrors = await validateForm();

    if (logErrorsOnSubmit && validationErrors.length > 0)
      console.error(validationErrors);

    if (validationErrors.length && !shouldSubmitWhenInvalid) return null;

    // onSubmit should ideally return a Promise so that we can wait
    // for submission to complete, but we won't worry about it if it doesn't
    let submissionResult;
    try {
      submissionResult = await onSubmit(
        formData,
        validationErrors.length === 0
      );
    } catch (error) {
      console.error('Form "onSubmit" function error:', error);
      return null;
    }

    const { ok = true, errors: submissionErrors } = submissionResult || {};

    // Submission result must be an object with `ok` bool prop
    // and optional submission errors
    if (ok) {
      // Because `valueProp` is sometimes stale in this function, we have to
      // force a reset this way rather than by calling `setFormData` directly
      setForceReset(forceReset + 1);
      return null;
    }

    if (submissionErrors) {
      if (Array.isArray(submissionErrors)) {
        setErrors(submissionErrors);
      } else {
        console.error(
          'onSubmit returned an object with "errors" property that is not a valid errors array'
        );
      }
    }

    return null;
  }

  function getErrors(fieldPaths, { includeDescendantErrors = false } = {}) {
    if (!Array.isArray(fieldPaths)) {
      throw new Error(
        "First argument to getErrors must be an array of field paths"
      );
    }
    return filterErrorsForNames(errors, fieldPaths, !includeDescendantErrors);
  }

  function getFirstError(fieldPaths, options) {
    const fieldErrors = getErrors(fieldPaths, options);
    if (fieldErrors.length === 0) return null;
    return fieldErrors[0];
  }

  return {
    formData,
    getInputProps(fieldPath, getInputPropsOptions = {}) {
      const {
        isForm,
        nullValue,
        onChangeGetValue,
        onChangingGetValue,
        propNames = {},
      } = getInputPropsOptions;

      let fieldErrors = filterErrorsForNames(errors, [fieldPath], false);

      // Adjust the error names to correct scope for forms
      if (isForm) {
        const canonicalName = bracketsToDots(fieldPath);
        fieldErrors = fieldErrors.map((err) => ({
          ...err,
          name: bracketsToDots(err.name).slice(canonicalName.length + 1),
        }));
      }

      function onInputValueChange(...onChangeArgs) {
        // The composable forms spec calls for new value to be passed
        // directly as the first arg. Many popular libraries pass
        // an Event as the first arg, and `onChangeGetValue` can be
        // used to determine and return the new value.
        const inputValue = onChangeGetValue
          ? onChangeGetValue(...onChangeArgs)
          : onChangeArgs[0];

        const updatedFormData = setFieldValueInFormData(fieldPath, inputValue);

        // Now bubble up the `onChange`, possibly validating first
        if (
          validateOn === "changed" ||
          validateOn === "changing" ||
          (hasBeenValidated &&
            (revalidateOn === "changed" || revalidateOn === "changing"))
        ) {
          validateForm()
            .then((updatedErrors) => {
              onChange(updatedFormData, updatedErrors.length === 0);
              return null;
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          onChange(updatedFormData, errors.length === 0);
        }
      }

      function onInputValueChanging(...onChangingArgs) {
        // The composable forms spec calls for new value to be passed
        // directly as the first arg. Many popular libraries pass
        // an Event as the first arg, and `onChangeGetValue` can be
        // used to determine and return the new value.
        const inputValue = onChangingGetValue
          ? onChangingGetValue(...onChangingArgs)
          : onChangingArgs[0];

        const updatedFormData = setFieldValueInFormData(fieldPath, inputValue);

        if (
          validateOn === "changing" ||
          (hasBeenValidated && revalidateOn === "changing")
        ) {
          validateForm()
            .then((updatedErrors) => {
              onChanging(updatedFormData, updatedErrors.length === 0);
              return null;
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          onChanging(updatedFormData, errors.length === 0);
        }
      }

      // Some input components (MUI) do not accept a `null` value.
      // For these, passing `{ nullValue: "" }` options does the trick.
      let value = get(formData, fieldPath, null);
      if (value === null && nullValue !== undefined) value = nullValue;

      const inputProps = {
        [propNames.errors || "errors"]: fieldErrors,
        [propNames.hasBeenValidated || "hasBeenValidated"]: hasBeenValidated,
        [propNames.isReadOnly || "isReadOnly"]: isReadOnly,
        [propNames.name || "name"]: fieldPath,
        [propNames.onChange || "onChange"]: onInputValueChange,
        [propNames.onChanging || "onChanging"]: onInputValueChanging,
        [propNames.onSubmit || "onSubmit"]: submitForm,
        [propNames.value || "value"]: value,
      };

      // If propNames key is set to `false`, omit the prop
      [
        "errors",
        "hasBeenValidated",
        "isReadOnly",
        "name",
        "onChange",
        "onChanging",
        "onSubmit",
        "value",
      ].forEach((key) => {
        if (propNames[key] === false) delete inputProps[key];
      });

      return inputProps;
    },
    getErrors,
    getFirstError,
    getFirstErrorMessage(fieldPaths, options) {
      const fieldError = getFirstError(fieldPaths, options);
      return (fieldError && fieldError.message) || null;
    },
    hasBeenValidated,
    hasErrors(fieldPaths, options) {
      return getErrors(fieldPaths, options).length > 0;
    },
    // Form is dirty if value prop doesn't match value state. Whenever a changed
    // value prop comes in, we reset state to that, thus becoming clean.
    isDirty: !isEqual(formData, valueProp),
    resetValue() {
      // Because `valueProp` is sometimes stale in this function, we have to
      // force a reset this way rather than by calling `setFormData` directly
      setForceReset(forceReset + 1);
    },
    submitForm,
  };
}
