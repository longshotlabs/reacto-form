"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _get = _interopRequireDefault(require("lodash/get"));

var _set = _interopRequireDefault(require("lodash/set"));

var _unset = _interopRequireDefault(require("lodash/unset"));

var _clone = _interopRequireDefault(require("clone"));

var _bracketsToDots = _interopRequireDefault(require("./shared/bracketsToDots"));

var _propTypes2 = _interopRequireDefault(require("./shared/propTypes"));

var _filterErrorsForNames = _interopRequireDefault(require("./shared/filterErrorsForNames"));

var _recursivelyCloneElements = _interopRequireDefault(require("./shared/recursivelyCloneElements"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// To ensure we do not mutate objects passed in, we'll do a deep clone.
function cloneValue(value) {
  return value ? (0, _clone.default)(value) : {};
}

var Form = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Form, _Component);

  var _super = _createSuper(Form);

  function Form(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Form);
    _this = _super.call(this, props);
    _this.state = {
      errors: [],
      hasBeenValidated: false,
      value: cloneValue(props.value)
    };
    _this.elementRefs = [];
    return _this;
  }

  (0, _createClass2.default)(Form, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMounted = true;
    } // eslint-disable-next-line camelcase

  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this$props = this.props,
          hasBeenValidated = _this$props.hasBeenValidated,
          value = _this$props.value;
      var hasBeenValidatedNext = nextProps.hasBeenValidated,
          nextValue = nextProps.value; // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.

      if (!(0, _isEqual.default)(value, nextValue)) {
        this.setState({
          errors: [],
          value: cloneValue(nextValue)
        });
      } // Let props override the `hasBeenValidated` state


      if (typeof hasBeenValidatedNext === "boolean" && hasBeenValidatedNext !== hasBeenValidated) {
        this.setState({
          hasBeenValidated: hasBeenValidatedNext
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: "getFieldOnSubmitHandler",
    value: function getFieldOnSubmitHandler(fieldHandler) {
      var _this2 = this;

      return function () {
        if (fieldHandler) fieldHandler();

        _this2.submit();
      };
    }
  }, {
    key: "getFieldOnChangeHandler",
    value: function getFieldOnChangeHandler(fieldName, fieldHandler) {
      var _this3 = this;

      return function (value) {
        if (fieldHandler) fieldHandler(value);
        var _this3$props = _this3.props,
            validateOn = _this3$props.validateOn,
            revalidateOn = _this3$props.revalidateOn;
        var _this3$state = _this3.state,
            errors = _this3$state.errors,
            hasBeenValidated = _this3$state.hasBeenValidated;

        _this3.doSet(_this3.state.value, fieldName, value);

        if (validateOn === "changed" || validateOn === "changing" || hasBeenValidated && (revalidateOn === "changed" || revalidateOn === "changing")) {
          _this3.validate().then(function (updatedErrors) {
            if (!_this3._isMounted) return null;

            _this3.props.onChange(_this3.state.value, updatedErrors.length === 0);
          });
        } else {
          _this3.props.onChange(_this3.state.value, errors.length === 0);
        }
      };
    }
  }, {
    key: "getFieldOnChangingHandler",
    value: function getFieldOnChangingHandler(fieldName, fieldHandler) {
      var _this4 = this;

      return function (value) {
        if (fieldHandler) fieldHandler(value);
        var _this4$props = _this4.props,
            validateOn = _this4$props.validateOn,
            revalidateOn = _this4$props.revalidateOn;
        var _this4$state = _this4.state,
            errors = _this4$state.errors,
            hasBeenValidated = _this4$state.hasBeenValidated;

        _this4.doSet(_this4.state.value, fieldName, value);

        if (validateOn === "changing" || hasBeenValidated && revalidateOn === "changing") {
          _this4.validate().then(function (updatedErrors) {
            if (!_this4._isMounted) return null;

            _this4.props.onChanging(_this4.state.value, updatedErrors.length === 0);
          });
        } else {
          _this4.props.onChanging(_this4.state.value, errors.length === 0);
        }
      };
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.state.value;
    }
  }, {
    key: "getErrors",
    value: function getErrors(fieldPaths) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$includeDescendan = _ref.includeDescendantErrors,
          includeDescendantErrors = _ref$includeDescendan === void 0 ? false : _ref$includeDescendan;

      var errors = this.props.errors;

      if (!Array.isArray(fieldPaths)) {
        throw new Error("First argument to getErrors must be an array of field paths");
      }

      return (0, _filterErrorsForNames.default)(errors, fieldPaths, !includeDescendantErrors);
    }
  }, {
    key: "getFirstError",
    value: function getFirstError(fieldPaths, options) {
      var fieldErrors = this.getErrors(fieldPaths, options);
      if (fieldErrors.length === 0) return null;
      return fieldErrors[0];
    }
  }, {
    key: "getFirstErrorMessage",
    value: function getFirstErrorMessage(fieldPaths, options) {
      var fieldError = this.getFirstError(fieldPaths, options);
      return fieldError && fieldError.message || null;
    }
  }, {
    key: "resetValue",
    value: function resetValue() {
      var _this5 = this;

      this.setState({
        errors: [],
        hasBeenValidated: false,
        value: cloneValue(this.props.value)
      }, function () {
        _this5.elementRefs.forEach(function (element) {
          if (element && typeof element.resetValue === "function") element.resetValue();
        });
      });
    }
  }, {
    key: "doSet",
    value: function doSet(obj, path, value, callback) {
      // Since we clone the object whenever we set state from props, we can directly
      // set the prop rather than copying the whole object.
      if (value === undefined) {
        (0, _unset.default)(obj, path);
      } else {
        (0, _set.default)(obj, path, value);
      }

      this.setState({
        value: obj
      }, callback);
    } // Form is dirty if value prop doesn't match value state. Whenever a changed
    // value prop comes in, we reset state to that, thus becoming clean.

  }, {
    key: "isDirty",
    value: function isDirty() {
      return !(0, _isEqual.default)(this.state.value, this.props.value);
    }
  }, {
    key: "hasErrors",
    value: function hasErrors(fieldPaths, options) {
      return this.getErrors(fieldPaths, options).length > 0;
    }
    /**
     * @return {Promise<Object[]>} A Promise that resolves with an array of errors. If the
     *   array is empty, there were no errors and submission was successful.
     */

  }, {
    key: "submit",
    value: function submit() {
      var _this6 = this;

      var _this$props2 = this.props,
          logErrorsOnSubmit = _this$props2.logErrorsOnSubmit,
          onSubmit = _this$props2.onSubmit,
          shouldSubmitWhenInvalid = _this$props2.shouldSubmitWhenInvalid;
      var value = this.state.value;
      return this.validate().then(function (errors) {
        if (logErrorsOnSubmit && errors.length > 0) console.error(errors);
        if (!_this6._isMounted) return errors;
        if (errors.length && !shouldSubmitWhenInvalid) return errors;
        return Promise.resolve().then(function () {
          // onSubmit should ideally return a Promise so that we can wait
          // for submission to complete, but we won't worry about it if it doesn't
          return onSubmit(value, errors.length === 0);
        }).then(function () {
          var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              _ref2$ok = _ref2.ok,
              ok = _ref2$ok === void 0 ? true : _ref2$ok,
              _ref2$errors = _ref2.errors,
              submissionErrors = _ref2$errors === void 0 ? [] : _ref2$errors;

          // Submission result must be an object with `ok` bool prop
          // and optional submission errors
          if (!Array.isArray(submissionErrors)) {
            throw new Error("onSubmit returned an errors value that is not an array");
          }

          if (_this6._isMounted) {
            if (ok) {
              _this6.resetValue();
            } else {
              _this6.setState({
                errors: submissionErrors
              });
            }
          }

          return submissionErrors;
        }).catch(function (error) {
          if (error) console.error('Form "onSubmit" function error:', error);
        });
      }).catch(function (error) {
        if (error) console.error('Form "validate" function error:', error);
      });
    }
  }, {
    key: "validate",
    value: function validate() {
      var _this7 = this;

      var validator = this.props.validator;
      var value = this.state.value;
      if (typeof validator !== "function") return Promise.resolve([]);
      return validator(value).then(function (errors) {
        if (!Array.isArray(errors)) {
          console.error("validator function must return a Promise that resolves with an array");
          return [];
        }

        if (_this7._isMounted) {
          _this7.setState({
            errors: errors,
            hasBeenValidated: true
          });
        }

        return errors;
      });
    }
  }, {
    key: "renderFormFields",
    value: function renderFormFields() {
      var _this8 = this;

      var value = this.state.value;
      if (!value) value = {};
      var _this$props3 = this.props,
          children = _this$props3.children,
          _this$props3$inputOpt = _this$props3.inputOptions,
          nullValue = _this$props3$inputOpt.nullValue,
          propNames = _this$props3$inputOpt.propNames;
      var propErrors = this.props.errors;
      var _this$state = this.state,
          stateErrors = _this$state.errors,
          hasBeenValidated = _this$state.hasBeenValidated;
      if (!Array.isArray(propErrors)) propErrors = [];
      var errors = propErrors.concat(stateErrors);
      this.elementRefs = [];

      var propsFunc = function propsFunc(element) {
        var newProps = {};

        if (element.type.isFormField) {
          var name = element.props[propNames.name];
          if (!name) return {};

          if (element.props.errors === undefined) {
            newProps.errors = (0, _filterErrorsForNames.default)(errors, [name], false);
          }
        } else if (element.type.isFormErrors) {
          var names = element.props.names;
          if (!names) return {};

          if (element.props[propNames.errors] === undefined) {
            newProps[propNames.errors] = (0, _filterErrorsForNames.default)(errors, names, true);
          }
        } else if (element.type.isFormInput || element.type.isForm || element.type.isFormList) {
          var _name = element.props[propNames.name];
          if (!_name) return {};
          newProps[propNames.onChange] = _this8.getFieldOnChangeHandler(_name, element.props[propNames.onChange]);
          newProps[propNames.onChanging] = _this8.getFieldOnChangingHandler(_name, element.props[propNames.onChanging]);
          newProps[propNames.onSubmit] = _this8.getFieldOnSubmitHandler(element.props[propNames.onSubmit]);

          if (element.props[propNames.value] === undefined) {
            // Some input components (MUI) do not accept a `null` value.
            // For these, passing `{ nullValue: "" }` options does the trick.
            var inputValue = (0, _get.default)(value, _name);
            if (inputValue === null && nullValue !== undefined) inputValue = nullValue;
            newProps[propNames.value] = inputValue;
          }

          if (element.props[propNames.errors] === undefined) {
            newProps[propNames.errors] = (0, _filterErrorsForNames.default)(errors, [_name], false); // Adjust the error names to correct scope

            if (element.type.isForm) {
              var canonicalName = (0, _bracketsToDots.default)(_name);
              newProps[propNames.errors] = newProps[propNames.errors].map(function (err) {
                return _objectSpread(_objectSpread({}, err), {}, {
                  name: (0, _bracketsToDots.default)(err.name).slice(canonicalName.length + 1)
                });
              });
            }
          }

          newProps[propNames.hasBeenValidated] = hasBeenValidated;

          if (element.type.isFormInput) {
            if (typeof element.props[propNames.isReadOnly] === "function") {
              newProps[propNames.isReadOnly] = element.props.isReadOnly(value);
            }
          }

          newProps.ref = function (el) {
            _this8.elementRefs.push(el);
          };
        }

        return newProps;
      };

      return (0, _recursivelyCloneElements.default)(children, propsFunc, function (element) {
        // Leave children of nested forms alone because they're handled by that form
        // Leave children of lists alone because the FormList component deals with duplicating them
        return element.type.isForm || element.type.isFormList;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          className = _this$props4.className,
          style = _this$props4.style;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: className,
        style: style
      }, this.renderFormFields());
    }
  }]);
  return Form;
}(_react.Component);

(0, _defineProperty2.default)(Form, "isForm", true);
Form.propTypes = {
  children: _propTypes.default.node.isRequired,
  className: _propTypes.default.string,
  errors: _propTypes2.default.errors,
  hasBeenValidated: _propTypes.default.bool,
  inputOptions: _propTypes.default.shape({
    // eslint-disable-next-line react/forbid-prop-types
    nullValue: _propTypes.default.any,
    propNames: _propTypes.default.shape({
      errors: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
      hasBeenValidated: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
      isReadOnly: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
      name: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
      onChange: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
      onChanging: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
      onSubmit: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
      value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool])
    })
  }),
  logErrorsOnSubmit: _propTypes.default.bool,
  // Top-level forms and those under FormList do not need a name
  name: _propTypes.default.string,
  // eslint-disable-line react/no-unused-prop-types
  onChange: _propTypes.default.func,
  onChanging: _propTypes.default.func,
  onSubmit: _propTypes.default.func,
  revalidateOn: _propTypes.default.oneOf(["changing", "changed", "submit"]),
  style: _propTypes.default.object,
  // eslint-disable-line react/forbid-prop-types
  shouldSubmitWhenInvalid: _propTypes.default.bool,
  validateOn: _propTypes.default.oneOf(["changing", "changed", "submit"]),
  validator: _propTypes.default.func,
  value: _propTypes.default.object // eslint-disable-line react/forbid-prop-types

};
Form.defaultProps = {
  className: null,
  errors: undefined,
  hasBeenValidated: false,
  inputOptions: {
    nullValue: undefined,
    propNames: {
      errors: "errors",
      hasBeenValidated: "hasBeenValidated",
      isReadOnly: "isReadOnly",
      name: "name",
      onChange: "onChange",
      onChanging: "onChanging",
      onSubmit: "onSubmit",
      value: "value"
    }
  },
  logErrorsOnSubmit: false,
  name: null,
  onChange: function onChange() {},
  onChanging: function onChanging() {},
  onSubmit: function onSubmit() {},
  revalidateOn: "changing",
  style: {},
  shouldSubmitWhenInvalid: false,
  validateOn: "submit",
  validator: undefined,
  value: undefined
};
var _default = Form;
exports.default = _default;