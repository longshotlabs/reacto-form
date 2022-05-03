"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

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

var styles = {
  button: {
    paddingTop: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 0,
    width: "3.5rem",
    height: "3.5rem",
    verticalAlign: "-webkit-baseline-middle"
  },
  item: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderBottomStyle: "solid",
    borderTopStyle: "none",
    borderLeftStyle: "none",
    borderRightStyle: "none",
    paddingBottom: "1rem",
    marginBottom: "1rem"
  },
  itemLeft: {
    paddingRight: "1.5rem"
  },
  itemRight: {
    flexGrow: 1
  },
  lastItem: {
    display: "flex",
    flexDirection: "row"
  },
  list: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderStyle: "solid",
    borderRadius: 3,
    padding: "1rem"
  },
  addItemRow: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderBottomStyle: "none",
    borderTopStyle: "solid",
    borderLeftStyle: "none",
    borderRightStyle: "none",
    paddingTop: "1rem",
    marginTop: "1rem"
  }
};

var FormList = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(FormList, _Component);

  var _super = _createSuper(FormList);

  function FormList(props) {
    var _this;

    (0, _classCallCheck2.default)(this, FormList);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClickAddItem", function () {
      var value = _this.state.value;
      value.push(null);

      _this.setState({
        value: value
      });
    });
    var minCount = props.minCount,
        _value = props.value;
    _value = (0, _clone.default)(_value || []);
    minCount = minCount || 0;

    while (_value.length < minCount) {
      _value.push(null);
    }

    _this.state = {
      value: _value
    };
    _this.elementRefs = [];
    return _this;
  } // eslint-disable-next-line camelcase


  (0, _createClass2.default)(FormList, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var value = this.state.value;
      this.handleChanging(value);
      this.handleChanged(value);
    } // eslint-disable-next-line camelcase

  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var value = this.props.value;
      var minCount = nextProps.minCount,
          nextValue = nextProps.value;
      var stateValue = this.state.value; // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.

      if (!(0, _isEqual.default)(value, nextValue)) {
        nextValue = (0, _clone.default)(nextValue || []);
        minCount = minCount || 0;

        while (nextValue.length < minCount) {
          nextValue.push(null);
        } // We also keep the array length the same so that items don't disappear and
        // confuse the user.


        while (nextValue.length < stateValue.length) {
          nextValue.push(null);
        }

        this.setState({
          value: nextValue
        });
        this.handleChanging(nextValue);
        this.handleChanged(nextValue);
      }
    }
  }, {
    key: "handleChanged",
    value: function handleChanged(value) {
      var onChange = this.props.onChange;

      if (!(0, _isEqual.default)(value, this.lastChangedValue)) {
        this.lastChangedValue = value;
        onChange(value);
      }
    }
  }, {
    key: "handleChanging",
    value: function handleChanging(value) {
      var onChanging = this.props.onChanging;

      if (!(0, _isEqual.default)(value, this.lastChangingValue)) {
        this.lastChangingValue = value;
        onChanging(value);
      }
    }
  }, {
    key: "handleClickRemoveItem",
    value: function handleClickRemoveItem(index) {
      var _this2 = this;

      return function () {
        var minCount = _this2.props.minCount;
        var value = _this2.state.value;
        if (value.length === Math.max(minCount || 0, 0)) return;
        value.splice(index, 1); // mutation is ok because we cloned, and likely faster

        _this2.setState({
          value: value
        });

        _this2.handleChanging(value);

        _this2.handleChanged(value);
      };
    }
  }, {
    key: "getFieldValueHandler",
    value: function getFieldValueHandler(index, isChanged) {
      var _this3 = this;

      return function (itemValue) {
        var value = _this3.state.value;
        value[index] = itemValue;

        _this3.setState({
          value: value
        });

        if (isChanged) {
          _this3.handleChanged(value);
        } else {
          _this3.handleChanging(value);
        }
      };
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.state.value;
    }
  }, {
    key: "resetValue",
    value: function resetValue() {
      var _this$props = this.props,
          minCount = _this$props.minCount,
          value = _this$props.value;
      value = (0, _clone.default)(value || []);
      minCount = minCount || 0;

      while (value.length < minCount) {
        value.push(null);
      }

      this.setState({
        value: value
      });
      this.elementRefs.forEach(function (element) {
        if (element && typeof element.resetValue === "function") element.resetValue();
      });
    }
  }, {
    key: "renderArrayItems",
    value: function renderArrayItems() {
      var _this4 = this;

      var _this$props2 = this.props,
          buttonClassName = _this$props2.buttonClassName,
          buttonStyle = _this$props2.buttonStyle,
          children = _this$props2.children,
          errors = _this$props2.errors,
          itemAreaClassName = _this$props2.itemAreaClassName,
          itemAreaStyle = _this$props2.itemAreaStyle,
          itemClassName = _this$props2.itemClassName,
          itemStyle = _this$props2.itemStyle,
          itemRemoveAreaClassName = _this$props2.itemRemoveAreaClassName,
          itemRemoveAreaStyle = _this$props2.itemRemoveAreaStyle,
          minCount = _this$props2.minCount,
          name = _this$props2.name,
          onSubmit = _this$props2.onSubmit,
          removeButtonText = _this$props2.removeButtonText;
      var value = this.state.value; // We'll do these checks just once, outside of the `value.map`, for speed.
      // This extra loop might be slower for small arrays, but will help with large arrays.

      var itemChild;
      var errorsChild;

      _react.default.Children.forEach(children, function (child) {
        if (child.type.isFormList) {
          throw new Error("reacto-form FormList: FormList may not be a child of FormList");
        }

        if (child.type.isForm || child.type.isFormInput) {
          if (itemChild) throw new Error("reacto-form FormList: FormList must have exactly one Input or Form child");
          itemChild = child;
        }

        if (child.type.isFormErrors) {
          if (errorsChild) throw new Error("reacto-form FormList: FormList may have no more than one ErrorsBlock child");
          errorsChild = child;
        }
      });

      var hasMoreThanMinCount = value.length > Math.max(minCount || 0, 0);
      this.elementRefs = [];
      return value.map(function (itemValue, index) {
        var itemName = "".concat(name, "[").concat(index, "]");

        var kids = _react.default.Children.map(children, function (child) {
          if (child.type.isForm || child.type.isFormInput) {
            var filteredErrors = (0, _filterErrorsForNames.default)(errors, [itemName], false); // Adjust the error names to correct scope

            if (child.type.isForm) {
              filteredErrors = filteredErrors.map(function (err) {
                return _objectSpread(_objectSpread({}, err), {}, {
                  name: (0, _bracketsToDots.default)(err.name).slice("".concat(name, ".").concat(index).length + 1)
                });
              });
            }

            return /*#__PURE__*/_react.default.cloneElement(child, {
              errors: filteredErrors,
              name: itemName,
              onChange: _this4.getFieldValueHandler(index, true),
              onChanging: _this4.getFieldValueHandler(index, false),
              onSubmit: onSubmit,
              ref: function ref(el) {
                _this4.elementRefs.push(el);
              },
              value: itemValue
            }, (0, _recursivelyCloneElements.default)(child.props.children));
          }

          if (child.type.isFormErrors) {
            return /*#__PURE__*/_react.default.cloneElement(child, {
              errors: (0, _filterErrorsForNames.default)(errors, [itemName], true),
              names: [itemName]
            }, (0, _recursivelyCloneElements.default)(child.props.children));
          }

          return (0, _recursivelyCloneElements.default)(child);
        });

        var resolvedItemStyle = index + 1 === value.length ? styles.lastItem : styles.item;
        resolvedItemStyle = _objectSpread(_objectSpread({}, resolvedItemStyle), itemStyle);
        return /*#__PURE__*/_react.default.createElement("div", {
          className: itemClassName,
          key: itemName,
          style: resolvedItemStyle
        }, hasMoreThanMinCount && /*#__PURE__*/_react.default.createElement("div", {
          className: itemRemoveAreaClassName,
          style: _objectSpread(_objectSpread({}, styles.itemLeft), itemRemoveAreaStyle)
        }, /*#__PURE__*/_react.default.createElement("button", {
          type: "button",
          className: buttonClassName,
          onClick: _this4.handleClickRemoveItem(index),
          style: _objectSpread(_objectSpread({}, styles.button), buttonStyle)
        }, removeButtonText)), /*#__PURE__*/_react.default.createElement("div", {
          className: itemAreaClassName,
          style: _objectSpread(_objectSpread({}, styles.itemRight), itemAreaStyle)
        }, kids));
      });
    }
  }, {
    key: "renderAddItemButton",
    value: function renderAddItemButton() {
      var _this$props3 = this.props,
          addButtonText = _this$props3.addButtonText,
          addItemRowStyle = _this$props3.addItemRowStyle,
          buttonClassName = _this$props3.buttonClassName,
          itemClassName = _this$props3.itemClassName;
      var value = this.state.value;
      var resolvedStyle = value.length === 0 ? {} : styles.addItemRow;
      resolvedStyle = _objectSpread(_objectSpread({}, resolvedStyle), addItemRowStyle);
      return /*#__PURE__*/_react.default.createElement("div", {
        className: itemClassName,
        style: resolvedStyle
      }, /*#__PURE__*/_react.default.createElement("button", {
        type: "button",
        className: buttonClassName,
        onClick: this.handleClickAddItem,
        style: styles.button
      }, addButtonText));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          className = _this$props4.className,
          maxCount = _this$props4.maxCount,
          style = _this$props4.style;
      var value = this.state.value;
      if (!value) value = [];
      var hasFewerThanMaxCount = value.length < maxCount || maxCount === undefined || maxCount === null;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: className,
        style: _objectSpread(_objectSpread({}, styles.list), style)
      }, this.renderArrayItems(), hasFewerThanMaxCount && this.renderAddItemButton());
    }
  }]);
  return FormList;
}(_react.Component);

(0, _defineProperty2.default)(FormList, "isFormList", true);
FormList.propTypes = {
  addButtonText: _propTypes.default.string,
  addItemRowStyle: _propTypes.default.object,
  // eslint-disable-line react/forbid-prop-types
  buttonClassName: _propTypes.default.string,
  buttonStyle: _propTypes.default.object,
  // eslint-disable-line react/forbid-prop-types
  children: _propTypes.default.node.isRequired,
  className: _propTypes.default.string,
  errors: _propTypes2.default.errors,
  itemAreaClassName: _propTypes.default.string,
  itemAreaStyle: _propTypes.default.object,
  // eslint-disable-line react/forbid-prop-types
  itemClassName: _propTypes.default.string,
  itemStyle: _propTypes.default.object,
  // eslint-disable-line react/forbid-prop-types
  itemRemoveAreaClassName: _propTypes.default.string,
  itemRemoveAreaStyle: _propTypes.default.object,
  // eslint-disable-line react/forbid-prop-types
  maxCount: _propTypes.default.number,
  minCount: _propTypes.default.number,
  name: _propTypes.default.string.isRequired,
  onChanging: _propTypes.default.func,
  onChange: _propTypes.default.func,
  onSubmit: _propTypes.default.func,
  removeButtonText: _propTypes.default.string,
  style: _propTypes.default.object,
  // eslint-disable-line react/forbid-prop-types
  value: _propTypes.default.arrayOf(_propTypes.default.any)
};
FormList.defaultProps = {
  addButtonText: "+",
  addItemRowStyle: {},
  buttonClassName: null,
  buttonStyle: {},
  className: null,
  errors: undefined,
  itemAreaClassName: null,
  itemAreaStyle: {},
  itemClassName: null,
  itemStyle: {},
  itemRemoveAreaClassName: null,
  itemRemoveAreaStyle: {},
  minCount: 0,
  maxCount: undefined,
  onChanging: function onChanging() {},
  onChange: function onChange() {},
  onSubmit: function onSubmit() {},
  removeButtonText: "–",
  style: {},
  value: undefined
};
var _default = FormList;
exports.default = _default;