import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import clone from "clone";
import bracketsToDots from "./shared/bracketsToDots";
import customPropTypes from "./shared/propTypes";
import filterErrorsForNames from "./shared/filterErrorsForNames";
import recursivelyCloneElements from "./shared/recursivelyCloneElements";
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

class FormList extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleClickAddItem", () => {
      var {
        value
      } = this.state;
      value.push(null);
      this.setState({
        value
      });
    });

    var {
      minCount,
      value: _value
    } = props;
    _value = clone(_value || []);
    minCount = minCount || 0;

    while (_value.length < minCount) {
      _value.push(null);
    }

    this.state = {
      value: _value
    };
    this.elementRefs = [];
  } // eslint-disable-next-line camelcase


  UNSAFE_componentWillMount() {
    var {
      value
    } = this.state;
    this.handleChanging(value);
    this.handleChanged(value);
  } // eslint-disable-next-line camelcase


  UNSAFE_componentWillReceiveProps(nextProps) {
    var {
      value
    } = this.props;
    var {
      minCount,
      value: nextValue
    } = nextProps;
    var {
      value: stateValue
    } = this.state; // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.

    if (!isEqual(value, nextValue)) {
      nextValue = clone(nextValue || []);
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

  handleChanged(value) {
    var {
      onChange
    } = this.props;

    if (!isEqual(value, this.lastChangedValue)) {
      this.lastChangedValue = value;
      onChange(value);
    }
  }

  handleChanging(value) {
    var {
      onChanging
    } = this.props;

    if (!isEqual(value, this.lastChangingValue)) {
      this.lastChangingValue = value;
      onChanging(value);
    }
  }

  handleClickRemoveItem(index) {
    return () => {
      var {
        minCount
      } = this.props;
      var {
        value
      } = this.state;
      if (value.length === Math.max(minCount || 0, 0)) return;
      value.splice(index, 1); // mutation is ok because we cloned, and likely faster

      this.setState({
        value
      });
      this.handleChanging(value);
      this.handleChanged(value);
    };
  }

  getFieldValueHandler(index, isChanged) {
    return itemValue => {
      var {
        value
      } = this.state;
      value[index] = itemValue;
      this.setState({
        value
      });

      if (isChanged) {
        this.handleChanged(value);
      } else {
        this.handleChanging(value);
      }
    };
  }

  getValue() {
    return this.state.value;
  }

  resetValue() {
    var {
      minCount,
      value
    } = this.props;
    value = clone(value || []);
    minCount = minCount || 0;

    while (value.length < minCount) {
      value.push(null);
    }

    this.setState({
      value
    });
    this.elementRefs.forEach(element => {
      if (element && typeof element.resetValue === "function") element.resetValue();
    });
  }

  renderArrayItems() {
    var {
      buttonClassName,
      buttonStyle,
      children,
      errors,
      itemAreaClassName,
      itemAreaStyle,
      itemClassName,
      itemStyle,
      itemRemoveAreaClassName,
      itemRemoveAreaStyle,
      minCount,
      name,
      onSubmit,
      removeButtonText
    } = this.props;
    var {
      value
    } = this.state; // We'll do these checks just once, outside of the `value.map`, for speed.
    // This extra loop might be slower for small arrays, but will help with large arrays.

    var itemChild;
    var errorsChild;
    React.Children.forEach(children, child => {
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
    return value.map((itemValue, index) => {
      var itemName = "".concat(name, "[").concat(index, "]");
      var kids = React.Children.map(children, child => {
        if (child.type.isForm || child.type.isFormInput) {
          var filteredErrors = filterErrorsForNames(errors, [itemName], false); // Adjust the error names to correct scope

          if (child.type.isForm) {
            filteredErrors = filteredErrors.map(err => {
              return _objectSpread(_objectSpread({}, err), {}, {
                name: bracketsToDots(err.name).slice("".concat(name, ".").concat(index).length + 1)
              });
            });
          }

          return /*#__PURE__*/React.cloneElement(child, {
            errors: filteredErrors,
            name: itemName,
            onChange: this.getFieldValueHandler(index, true),
            onChanging: this.getFieldValueHandler(index, false),
            onSubmit,
            ref: el => {
              this.elementRefs.push(el);
            },
            value: itemValue
          }, recursivelyCloneElements(child.props.children));
        }

        if (child.type.isFormErrors) {
          return /*#__PURE__*/React.cloneElement(child, {
            errors: filterErrorsForNames(errors, [itemName], true),
            names: [itemName]
          }, recursivelyCloneElements(child.props.children));
        }

        return recursivelyCloneElements(child);
      });
      var resolvedItemStyle = index + 1 === value.length ? styles.lastItem : styles.item;
      resolvedItemStyle = _objectSpread(_objectSpread({}, resolvedItemStyle), itemStyle);
      return /*#__PURE__*/React.createElement("div", {
        className: itemClassName,
        key: itemName,
        style: resolvedItemStyle
      }, hasMoreThanMinCount && /*#__PURE__*/React.createElement("div", {
        className: itemRemoveAreaClassName,
        style: _objectSpread(_objectSpread({}, styles.itemLeft), itemRemoveAreaStyle)
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: buttonClassName,
        onClick: this.handleClickRemoveItem(index),
        style: _objectSpread(_objectSpread({}, styles.button), buttonStyle)
      }, removeButtonText)), /*#__PURE__*/React.createElement("div", {
        className: itemAreaClassName,
        style: _objectSpread(_objectSpread({}, styles.itemRight), itemAreaStyle)
      }, kids));
    });
  }

  renderAddItemButton() {
    var {
      addButtonText,
      addItemRowStyle,
      buttonClassName,
      itemClassName
    } = this.props;
    var {
      value
    } = this.state;
    var resolvedStyle = value.length === 0 ? {} : styles.addItemRow;
    resolvedStyle = _objectSpread(_objectSpread({}, resolvedStyle), addItemRowStyle);
    return /*#__PURE__*/React.createElement("div", {
      className: itemClassName,
      style: resolvedStyle
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: buttonClassName,
      onClick: this.handleClickAddItem,
      style: styles.button
    }, addButtonText));
  }

  render() {
    var {
      className,
      maxCount,
      style
    } = this.props;
    var {
      value
    } = this.state;
    if (!value) value = [];
    var hasFewerThanMaxCount = value.length < maxCount || maxCount === undefined || maxCount === null;
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      style: _objectSpread(_objectSpread({}, styles.list), style)
    }, this.renderArrayItems(), hasFewerThanMaxCount && this.renderAddItemButton());
  }

}

_defineProperty(FormList, "isFormList", true);

FormList.propTypes = {
  addButtonText: PropTypes.string,
  addItemRowStyle: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  buttonClassName: PropTypes.string,
  buttonStyle: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  errors: customPropTypes.errors,
  itemAreaClassName: PropTypes.string,
  itemAreaStyle: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  itemClassName: PropTypes.string,
  itemStyle: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  itemRemoveAreaClassName: PropTypes.string,
  itemRemoveAreaStyle: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  maxCount: PropTypes.number,
  minCount: PropTypes.number,
  name: PropTypes.string.isRequired,
  onChanging: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  removeButtonText: PropTypes.string,
  style: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  value: PropTypes.arrayOf(PropTypes.any)
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

  onChanging() {},

  onChange() {},

  onSubmit() {},

  removeButtonText: "–",
  style: {},
  value: undefined
};
export default FormList;