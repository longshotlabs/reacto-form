import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import union from 'lodash.union';
import uniqueId from 'lodash.uniqueid';
import without from 'lodash.without';

import customPropTypes from '../shared/propTypes';

class SelectCheckboxInput extends Component {
  static isFormInput = true;

  static propTypes = {
    ...customPropTypes.inputs,
    className: PropTypes.string,
    checkboxClassName: PropTypes.string,
    checkboxStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    itemClassName: PropTypes.string,
    itemStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    labelClassName: PropTypes.string,
    labelStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    options: customPropTypes.options,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    value: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ])),
  };

  static defaultProps = {
    className: undefined,
    checkboxClassName: undefined,
    checkboxStyle: {},
    itemClassName: undefined,
    itemStyle: {},
    labelClassName: undefined,
    labelStyle: {},
    emptyLabel: '(Select One)',
    isReadOnly: false,
    name: undefined,
    onChange() {},
    onChanging() {},
    options: [],
    placeholder: undefined,
    style: {},
    value: undefined,
  };

  constructor(props) {
    super(props);

    this.validateOptions(props.options);

    this.state = {
      value: props.value || [],
    };
  }

  componentWillMount() {
    this.handleChanged(this.state.value);
  }

  componentWillReceiveProps(nextProps) {
    const { options, value } = this.props;
    const { options: nextOptions, value: nextValue } = nextProps;

    // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
    if (!isEqual(value, nextValue)) {
      this.setValue(nextValue);
    }

    if (!isEqual(options, nextOptions)) {
      this.validateOptions(nextOptions);
    }
  }

  getOnChangeHandler(optionValue) {
    return (event) => {
      const { checked } = event.target;
      const { value: arrayValue } = this.state;
      const value = checked ? union(arrayValue, [optionValue]) : without(arrayValue, optionValue);
      this.setValue(value);
    };
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    value = value || [];
    this.setState({ value });
    this.handleChanged(value);
  }

  resetValue() {
    this.setValue(this.props.value);
  }

  handleChanged(value) {
    const { onChange, onChanging } = this.props;
    if (!isEqual(value, this.lastValue)) {
      this.lastValue = value;
      onChanging(value);
      onChange(value);
    }
  }

  // Input is dirty if value prop doesn't match value state. Whenever a changed
  // value prop comes in, we reset state to that, thus becoming clean.
  isDirty() {
    return !isEqual(this.state.value, this.props.value);
  }

  // Make sure all option values have the same data type, and record what that is
  validateOptions(options) {
    (options || []).forEach((option) => {
      if (option.optgroup) {
        this.validateOptions(option.options);
      } else {
        const checkDataType = typeof option.value;
        if (!this.dataType) {
          this.dataType = checkDataType;
        } else if (checkDataType !== this.dataType) {
          throw new Error(`reacto-form SelectCheckboxInput: All option values must have the same data type. The data type of the first option is "${this.dataType}" while the data type of the ${option.label} option is "${checkDataType}"`);
        }
      }
    });
  }

  renderOptions() {
    const { checkboxClassName, checkboxStyle, isReadOnly, itemClassName, itemStyle, labelClassName, labelStyle, options } = this.props;
    const { value } = this.state;

    return (options || []).map((option) => {
      const id = uniqueId('SelectCheckboxInput_');
      return (
        <div className={itemClassName} key={option.id || `${option.value}`} style={itemStyle}>
          <label htmlFor={id} className={labelClassName} style={labelStyle}>
            <input
              checked={value.indexOf(option.value) > -1}
              className={checkboxClassName}
              id={id}
              onChange={this.getOnChangeHandler(option.value)}
              readOnly={isReadOnly}
              style={checkboxStyle}
              type="checkbox"
              value={option.value}
            />
            {option.label}
          </label>
        </div>
      );
    });
  }

  render() {
    const { className, style } = this.props;

    return (
      <div className={className} style={style}>
        {this.renderOptions()}
      </div>
    );
  }
}

export default SelectCheckboxInput;
