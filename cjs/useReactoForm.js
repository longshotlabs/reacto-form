"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useReactoForm;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _clone = _interopRequireDefault(require("clone"));

var _get = _interopRequireDefault(require("lodash/get"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _set = _interopRequireDefault(require("lodash/set"));

var _bracketsToDots = _interopRequireDefault(require("./shared/bracketsToDots"));

var _filterErrorsForNames = _interopRequireDefault(require("./shared/filterErrorsForNames"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @summary To ensure we do not mutate objects passed in, we'll do a deep clone.
 * @param {Any} value Any value
 * @return {Object} Cloned value
 */
function cloneValue(value) {
  return value ? (0, _clone.default)(value) : {};
}
/**
 * @summary Main ReactoForm hook
 */


function useReactoForm(props) {
  var hasBeenValidatedProp = props.hasBeenValidated,
      _props$logErrorsOnSub = props.logErrorsOnSubmit,
      logErrorsOnSubmit = _props$logErrorsOnSub === void 0 ? false : _props$logErrorsOnSub,
      _props$onChange = props.onChange,
      onChange = _props$onChange === void 0 ? function () {} : _props$onChange,
      _props$onChanging = props.onChanging,
      onChanging = _props$onChanging === void 0 ? function () {} : _props$onChanging,
      _props$onSubmit = props.onSubmit,
      onSubmit = _props$onSubmit === void 0 ? function () {} : _props$onSubmit,
      _props$revalidateOn = props.revalidateOn,
      revalidateOn = _props$revalidateOn === void 0 ? "changing" : _props$revalidateOn,
      _props$shouldSubmitWh = props.shouldSubmitWhenInvalid,
      shouldSubmitWhenInvalid = _props$shouldSubmitWh === void 0 ? false : _props$shouldSubmitWh,
      _props$validateOn = props.validateOn,
      validateOn = _props$validateOn === void 0 ? "submit" : _props$validateOn,
      validator = props.validator,
      valueProp = props.value;

  var _useState = (0, _react.useState)([]),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      errors = _useState2[0],
      setErrors = _useState2[1];

  var _useState3 = (0, _react.useState)(hasBeenValidatedProp || false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      hasBeenValidated = _useState4[0],
      setHasBeenValidated = _useState4[1];

  var _useState5 = (0, _react.useState)(0),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      forceReset = _useState6[0],
      setForceReset = _useState6[1];

  var _useState7 = (0, _react.useState)({}),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      formData = _useState8[0],
      setFormData = _useState8[1]; // isReadOnly can be passed as a function, which is then called with
  // the current form data to determine whether it should be read only.


  var isReadOnly = props.isReadOnly;

  if (typeof isReadOnly === "function") {
    isReadOnly = !!isReadOnly(formData);
  }
  /**
   * @summary Set field value in state using lodash set
   * @return {Object} A copy of formData, mutated
   */


  function setFieldValueInFormData(fieldPath, fieldValue) {
    var formDataCopy = (0, _clone.default)(formData);
    (0, _set.default)(formDataCopy, fieldPath, fieldValue === undefined ? null : fieldValue);
    setFormData(formDataCopy);
    return formDataCopy;
  } // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.


  (0, _react.useEffect)(function () {
    setErrors([]);
    setHasBeenValidated(false);
    setFormData(cloneValue(valueProp));
  }, [valueProp, forceReset]); // Let props override the `hasBeenValidated` state

  (0, _react.useEffect)(function () {
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
    _validateForm = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var customValidatorErrors;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(typeof validator !== "function")) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", []);

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return validator(formData);

            case 5:
              customValidatorErrors = _context.sent;
              _context.next = 12;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);
              console.error(_context.t0);
              return _context.abrupt("return", []);

            case 12:
              if (Array.isArray(customValidatorErrors)) {
                _context.next = 15;
                break;
              }

              console.error("validator function must return or promise an array");
              return _context.abrupt("return", []);

            case 15:
              setErrors(customValidatorErrors);
              setHasBeenValidated(true);
              return _context.abrupt("return", customValidatorErrors);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 8]]);
    }));
    return _validateForm.apply(this, arguments);
  }

  function submitForm() {
    return _submitForm.apply(this, arguments);
  }

  function _submitForm() {
    _submitForm = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      var validationErrors, submissionResult, _ref2, _ref2$ok, ok, submissionErrors;

      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return validateForm();

            case 2:
              validationErrors = _context2.sent;
              if (logErrorsOnSubmit && validationErrors.length > 0) console.error(validationErrors);

              if (!(validationErrors.length && !shouldSubmitWhenInvalid)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt("return", null);

            case 6:
              _context2.prev = 6;
              _context2.next = 9;
              return onSubmit(formData, validationErrors.length === 0);

            case 9:
              submissionResult = _context2.sent;
              _context2.next = 16;
              break;

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](6);
              console.error('Form "onSubmit" function error:', _context2.t0);
              return _context2.abrupt("return", null);

            case 16:
              _ref2 = submissionResult || {}, _ref2$ok = _ref2.ok, ok = _ref2$ok === void 0 ? true : _ref2$ok, submissionErrors = _ref2.errors; // Submission result must be an object with `ok` bool prop
              // and optional submission errors

              if (!ok) {
                _context2.next = 20;
                break;
              }

              // Because `valueProp` is sometimes stale in this function, we have to
              // force a reset this way rather than by calling `setFormData` directly
              setForceReset(forceReset + 1);
              return _context2.abrupt("return", null);

            case 20:
              if (submissionErrors) {
                if (Array.isArray(submissionErrors)) {
                  setErrors(submissionErrors);
                } else {
                  console.error('onSubmit returned an object with "errors" property that is not a valid errors array');
                }
              }

              return _context2.abrupt("return", null);

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[6, 12]]);
    }));
    return _submitForm.apply(this, arguments);
  }

  function getErrors(fieldPaths) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$includeDescendan = _ref.includeDescendantErrors,
        includeDescendantErrors = _ref$includeDescendan === void 0 ? false : _ref$includeDescendan;

    if (!Array.isArray(fieldPaths)) {
      throw new Error("First argument to getErrors must be an array of field paths");
    }

    return (0, _filterErrorsForNames.default)(errors, fieldPaths, !includeDescendantErrors);
  }

  function getFirstError(fieldPaths, options) {
    var fieldErrors = getErrors(fieldPaths, options);
    if (fieldErrors.length === 0) return null;
    return fieldErrors[0];
  }

  return {
    formData: formData,
    getInputProps: function getInputProps(fieldPath) {
      var _inputProps;

      var getInputPropsOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var isForm = getInputPropsOptions.isForm,
          nullValue = getInputPropsOptions.nullValue,
          onChangeGetValue = getInputPropsOptions.onChangeGetValue,
          onChangingGetValue = getInputPropsOptions.onChangingGetValue,
          _getInputPropsOptions = getInputPropsOptions.propNames,
          propNames = _getInputPropsOptions === void 0 ? {} : _getInputPropsOptions;
      var fieldErrors = (0, _filterErrorsForNames.default)(errors, [fieldPath], false); // Adjust the error names to correct scope for forms

      if (isForm) {
        var canonicalName = (0, _bracketsToDots.default)(fieldPath);
        fieldErrors = fieldErrors.map(function (err) {
          return _objectSpread(_objectSpread({}, err), {}, {
            name: (0, _bracketsToDots.default)(err.name).slice(canonicalName.length + 1)
          });
        });
      }

      function onInputValueChange() {
        // The composable forms spec calls for new value to be passed
        // directly as the first arg. Many popular libraries pass
        // an Event as the first arg, and `onChangeGetValue` can be
        // used to determine and return the new value.
        var inputValue = onChangeGetValue ? onChangeGetValue.apply(void 0, arguments) : arguments.length <= 0 ? undefined : arguments[0];
        var updatedFormData = setFieldValueInFormData(fieldPath, inputValue); // Now bubble up the `onChange`, possibly validating first

        if (validateOn === "changed" || validateOn === "changing" || hasBeenValidated && (revalidateOn === "changed" || revalidateOn === "changing")) {
          validateForm().then(function (updatedErrors) {
            onChange(updatedFormData, updatedErrors.length === 0);
            return null;
          }).catch(function (error) {
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
        var inputValue = onChangingGetValue ? onChangingGetValue.apply(void 0, arguments) : arguments.length <= 0 ? undefined : arguments[0];
        var updatedFormData = setFieldValueInFormData(fieldPath, inputValue);

        if (validateOn === "changing" || hasBeenValidated && revalidateOn === "changing") {
          validateForm().then(function (updatedErrors) {
            onChanging(updatedFormData, updatedErrors.length === 0);
            return null;
          }).catch(function (error) {
            console.error(error);
          });
        } else {
          onChanging(updatedFormData, errors.length === 0);
        }
      } // Some input components (MUI) do not accept a `null` value.
      // For these, passing `{ nullValue: "" }` options does the trick.


      var value = (0, _get.default)(formData, fieldPath, null);
      if (value === null && nullValue !== undefined) value = nullValue;
      var inputProps = (_inputProps = {}, (0, _defineProperty2.default)(_inputProps, propNames.errors || "errors", fieldErrors), (0, _defineProperty2.default)(_inputProps, propNames.hasBeenValidated || "hasBeenValidated", hasBeenValidated), (0, _defineProperty2.default)(_inputProps, propNames.isReadOnly || "isReadOnly", isReadOnly), (0, _defineProperty2.default)(_inputProps, propNames.name || "name", fieldPath), (0, _defineProperty2.default)(_inputProps, propNames.onChange || "onChange", onInputValueChange), (0, _defineProperty2.default)(_inputProps, propNames.onChanging || "onChanging", onInputValueChanging), (0, _defineProperty2.default)(_inputProps, propNames.onSubmit || "onSubmit", submitForm), (0, _defineProperty2.default)(_inputProps, propNames.value || "value", value), _inputProps); // If propNames key is set to `false`, omit the prop

      ["errors", "hasBeenValidated", "isReadOnly", "name", "onChange", "onChanging", "onSubmit", "value"].forEach(function (key) {
        if (propNames[key] === false) delete inputProps[key];
      });
      return inputProps;
    },
    getErrors: getErrors,
    getFirstError: getFirstError,
    getFirstErrorMessage: function getFirstErrorMessage(fieldPaths, options) {
      var fieldError = getFirstError(fieldPaths, options);
      return fieldError && fieldError.message || null;
    },
    hasBeenValidated: hasBeenValidated,
    hasErrors: function hasErrors(fieldPaths, options) {
      return getErrors(fieldPaths, options).length > 0;
    },
    // Form is dirty if value prop doesn't match value state. Whenever a changed
    // value prop comes in, we reset state to that, thus becoming clean.
    isDirty: !(0, _isEqual.default)(formData, valueProp),
    resetValue: function resetValue() {
      // Because `valueProp` is sometimes stale in this function, we have to
      // force a reset this way rather than by calling `setFormData` directly
      setForceReset(forceReset + 1);
    },
    submitForm: submitForm
  };
}