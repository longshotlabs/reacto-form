import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import customPropTypes from '../shared/propTypes';

class SelectInput extends Component {
  static isFormInput = true;

  static propTypes = {
    ...customPropTypes.inputs,
    className: PropTypes.string,
    emptyLabel: PropTypes.string,
    options: customPropTypes.options,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
  };

  static defaultProps = {
    className: undefined,
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
      value: props.value || null,
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

  onChange = (event) => {
    let { value } = event.target;

    if (value !== undefined && value !== null) {
      switch (this.dataType) {
        case 'string':
          value = String(value);
          break;
        case 'number':
          value = value === '' ? null : Number(value);
          break;
        case 'boolean':
          value = value === '' ? null : Boolean(value);
          break;
        default:
          // do nothing
      }
    }

    this.setValue(value);
  };

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ value });
    this.handleChanged(value);
  }

  resetValue() {
    this.setValue(this.props.value);
  }

  handleChanged(value) {
    const { onChange, onChanging } = this.props;
    if (value !== this.lastValue) {
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
          throw new Error(`reacto-form SelectInput: All option values must have the same data type. The data type of the first option is "${this.dataType}" while the data type of the ${option.label} option is "${checkDataType}"`);
        }
      }
    });
  }

  renderOptions() {
    const { emptyLabel, options } = this.props;

    const userOpts = (options || []).map((option) => {
      if (option.optgroup) {
        return (
          <optgroup key={option.id || `${option.value}`} label={option.optgroup}>
            {(options.options || []).map((opt) => {
              return (
                <option key={opt.id || `${opt.value}`} value={opt.value}>{opt.label}</option>
              );
            })}
          </optgroup>
        );
      }
      return (
        <option key={option.id || `${option.value}`} value={option.value}>{option.label}</option>
      );
    });

    return [<option key="reacto-form-default" value="">{emptyLabel}</option>].concat(userOpts);
  }

  render() {
    const { className, isReadOnly, name, style } = this.props;
    const { value } = this.state;

    return (
      <select
        className={className}
        readOnly={isReadOnly}
        name={name}
        onChange={this.onChange}
        style={style}
        value={value || ''}
      >
        {this.renderOptions()}
      </select>
    );
  }
}

export default SelectInput;
