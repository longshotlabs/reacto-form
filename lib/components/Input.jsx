import React, { Component } from 'react';
import PropTypes from 'prop-types';

import customPropTypes from '../shared/propTypes';

class Input extends Component {
  static isComposableFormInput = true;

  static propTypes = {
    ...customPropTypes.inputs,
    allowLineBreaks: PropTypes.bool,
    className: PropTypes.string,
    convertEmptyStringToNull: PropTypes.bool,
    maxLength: PropTypes.number,
    onSubmit: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    trimValue: PropTypes.bool,
    type: PropTypes.oneOf([
      'color',
      'date',
      'datetime-local',
      'email',
      'file',
      'hidden',
      'month',
      'password',
      'range',
      'search',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ]),
    value: PropTypes.string,
  };

  static defaultProps = {
    allowLineBreaks: false,
    className: undefined,
    convertEmptyStringToNull: true,
    isReadOnly: false,
    maxLength: undefined,
    name: undefined,
    onChanged() {},
    onChanging() {},
    onSubmit() {},
    placeholder: undefined,
    style: {},
    trimValue: true,
    type: 'text',
    value: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
    };
  }

  componentWillMount() {
    const { value } = this.state;
    this.handleChanging(value);
    this.handleChanged(value);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    const { value: nextValue } = nextProps;

    // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
    if (value !== nextValue) {
      this.setValue(nextValue);
    }
  }

  onKeyPress = (event) => {
    const { onSubmit } = this.props;
    if (event.which === 13) onSubmit();
  };

  onBlur = (event) => {
    this.setValue(event.target.value);
  };

  onChange = (event) => {
    let { value } = event.target;
    value = value || '';
    this.setState({ value });
    this.handleChanging(value);
  };

  getValue() {
    return this.cleanValue(this.state.value);
  }

  setValue(value) {
    value = value || '';
    this.setState({ value });
    this.handleChanging(value);
    this.handleChanged(value);
  }

  cleanValue(value) {
    const { convertEmptyStringToNull, trimValue } = this.props;
    let outputValue = trimValue ? value.trim() : value;
    if (convertEmptyStringToNull && outputValue === '') outputValue = null;
    return outputValue;
  }

  resetValue() {
    this.setValue(this.props.value);
  }

  handleChanged(value) {
    const { onChanged } = this.props;
    const outputValue = this.cleanValue(value);
    if (outputValue !== this.lastChangedValue) {
      this.lastChangedValue = outputValue;
      onChanged(outputValue);
    }
  }

  handleChanging(value) {
    const { onChanging } = this.props;
    const outputValue = this.cleanValue(value);
    if (outputValue !== this.lastChangingValue) {
      this.lastChangingValue = outputValue;
      onChanging(outputValue);
    }
  }

  // Input is dirty if value prop doesn't match value state. Whenever a changed
  // value prop comes in, we reset state to that, thus becoming clean.
  isDirty() {
    return this.state.value !== this.props.value;
  }

  render() {
    const { allowLineBreaks, className, isReadOnly, maxLength, name, placeholder, style, type } = this.props;
    const { value } = this.state;

    if (allowLineBreaks) {
      // Same as "input" but without `onKeyPress` and `type` props.
      // We don't support rows; use style to set height instead
      return (
        <textarea
          className={className}
          readOnly={isReadOnly}
          maxLength={maxLength}
          name={name}
          onBlur={this.onBlur}
          onChange={this.onChange}
          placeholder={placeholder}
          style={style}
          value={value}
        />
      );
    }

    return (
      <input
        className={className}
        readOnly={isReadOnly}
        maxLength={maxLength}
        name={name}
        onKeyPress={this.onKeyPress}
        onBlur={this.onBlur}
        onChange={this.onChange}
        placeholder={placeholder}
        style={style}
        type={type}
        value={value}
      />
    );
  }
}

export default Input;
