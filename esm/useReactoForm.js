import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  var {
    hasBeenValidated: hasBeenValidatedProp,
    logErrorsOnSubmit = false,
    onChange = () => {},
    onChanging = () => {},
    onSubmit = () => {},
    revalidateOn = "changing",
    shouldSubmitWhenInvalid = false,
    validateOn = "submit",
    validator,
    value: valueProp
  } = props;
  var [errors, setErrors] = useState([]);
  var [hasBeenValidated, setHasBeenValidated] = useState(hasBeenValidatedProp || false);
  var [forceReset, setForceReset] = useState(0);
  var [formData, setFormData] = useState({}); // isReadOnly can be passed as a function, which is then called with
  // the current form data to determine whether it should be read only.

  var {
    isReadOnly
  } = props;

  if (typeof isReadOnly === "function") {
    isReadOnly = !!isReadOnly(formData);
  }
  /**
   * @summary Set field value in state using lodash set
   * @return {Object} A copy of formData, mutated
   */


  function setFieldValueInFormData(fieldPath, fieldValue) {
    var formDataCopy = clone(formData);
    set(formDataCopy, fieldPath, fieldValue === undefined ? null : fieldValue);
    setFormData(formDataCopy);
    return formDataCopy;
  } // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.


  useEffect(() => {
    setErrors([]);
    setHasBeenValidated(false);
    setFormData(cloneValue(valueProp));
  }, [valueProp, forceReset]); // Let props override the `hasBeenValidated` state

  useEffect(() => {
    if (typeof hasBeenValidatedProp === "boolean" && hasBeenValidatedProp !== hasBeenValidated) {
      setHasBeenValidated(hasBeenValidatedProp);
    }
  }, [hasBeenValidatedProp]);
  /**
   * @summary Validate the form
   * @return {Promise<Object[]>} Promised array of error objects
   */

  function validateForm() {
    return _validateForm.apply(this, arguments);
  }
  /**
   *
   */


  function _validateForm() {
    _validateForm = _asyncToGenerator(function* () {
      if (typeof validator !== "function") return [];
      var customValidatorErrors;

      try {
        customValidatorErrors = yield validator(formData);
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
    });
    return _validateForm.apply(this, arguments);
  }

  function submitForm() {
    return _submitForm.apply(this, arguments);
  }

  function _submitForm() {
    _submitForm = _asyncToGenerator(function* () {
      var validationErrors = yield validateForm();
      if (logErrorsOnSubmit && validationErrors.length > 0) console.error(validationErrors);
      if (validationErrors.length && !shouldSubmitWhenInvalid) return null; // onSubmit should ideally return a Promise so that we can wait
      // for submission to complete, but we won't worry about it if it doesn't

      var submissionResult;

      try {
        submissionResult = yield onSubmit(formData, validationErrors.length === 0);
      } catch (error) {
        console.error('Form "onSubmit" function error:', error);
        return null;
      }

      var {
        ok = true,
        errors: submissionErrors
      } = submissionResult || {}; // Submission result must be an object with `ok` bool prop
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
          console.error('onSubmit returned an object with "errors" property that is not a valid errors array');
        }
      }

      return null;
    });
    return _submitForm.apply(this, arguments);
  }

  function getErrors(fieldPaths) {
    var {
      includeDescendantErrors = false
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!Array.isArray(fieldPaths)) {
      throw new Error("First argument to getErrors must be an array of field paths");
    }

    return filterErrorsForNames(errors, fieldPaths, !includeDescendantErrors);
  }

  function getFirstError(fieldPaths, options) {
    var fieldErrors = getErrors(fieldPaths, options);
    if (fieldErrors.length === 0) return null;
    return fieldErrors[0];
  }

  return {
    formData,

    getInputProps(fieldPath) {
      var getInputPropsOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var {
        isForm,
        nullValue,
        onChangeGetValue,
        onChangingGetValue,
        propNames = {}
      } = getInputPropsOptions;
      var fieldErrors = filterErrorsForNames(errors, [fieldPath], false); // Adjust the error names to correct scope for forms

      if (isForm) {
        var canonicalName = bracketsToDots(fieldPath);
        fieldErrors = fieldErrors.map(err => _objectSpread(_objectSpread({}, err), {}, {
          name: bracketsToDots(err.name).slice(canonicalName.length + 1)
        }));
      }

      function onInputValueChange() {
        // The composable forms spec calls for new value to be passed
        // directly as the first arg. Many popular libraries pass
        // an Event as the first arg, and `onChangeGetValue` can be
        // used to determine and return the new value.
        var inputValue = onChangeGetValue ? onChangeGetValue(...arguments) : arguments.length <= 0 ? undefined : arguments[0];
        var updatedFormData = setFieldValueInFormData(fieldPath, inputValue); // Now bubble up the `onChange`, possibly validating first

        if (validateOn === "changed" || validateOn === "changing" || hasBeenValidated && (revalidateOn === "changed" || revalidateOn === "changing")) {
          validateForm().then(updatedErrors => {
            onChange(updatedFormData, updatedErrors.length === 0);
            return null;
          }).catch(error => {
            console.error(error);
          });
        } else {
          onChange(updatedFormData, errors.length === 0);
        }
      }

      function onInputValueChanging() {
        // The composable forms spec calls for new value to be passed
        // directly as the first arg. Many popular libraries pass
        // an Event as the first arg, and `onChangeGetValue` can be
        // used to determine and return the new value.
        var inputValue = onChangingGetValue ? onChangingGetValue(...arguments) : arguments.length <= 0 ? undefined : arguments[0];
        var updatedFormData = setFieldValueInFormData(fieldPath, inputValue);

        if (validateOn === "changing" || hasBeenValidated && revalidateOn === "changing") {
          validateForm().then(updatedErrors => {
            onChanging(updatedFormData, updatedErrors.length === 0);
            return null;
          }).catch(error => {
            console.error(error);
          });
        } else {
          onChanging(updatedFormData, errors.length === 0);
        }
      } // Some input components (MUI) do not accept a `null` value.
      // For these, passing `{ nullValue: "" }` options does the trick.


      var value = get(formData, fieldPath, null);
      if (value === null && nullValue !== undefined) value = nullValue;
      var inputProps = {
        [propNames.errors || "errors"]: fieldErrors,
        [propNames.hasBeenValidated || "hasBeenValidated"]: hasBeenValidated,
        [propNames.isReadOnly || "isReadOnly"]: isReadOnly,
        [propNames.name || "name"]: fieldPath,
        [propNames.onChange || "onChange"]: onInputValueChange,
        [propNames.onChanging || "onChanging"]: onInputValueChanging,
        [propNames.onSubmit || "onSubmit"]: submitForm,
        [propNames.value || "value"]: value
      }; // If propNames key is set to `false`, omit the prop

      ["errors", "hasBeenValidated", "isReadOnly", "name", "onChange", "onChanging", "onSubmit", "value"].forEach(key => {
        if (propNames[key] === false) delete inputProps[key];
      });
      return inputProps;
    },

    getErrors,
    getFirstError,

    getFirstErrorMessage(fieldPaths, options) {
      var fieldError = getFirstError(fieldPaths, options);
      return fieldError && fieldError.message || null;
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

    submitForm
  };
}