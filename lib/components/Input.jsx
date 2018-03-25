import React, { Component } from 'react';
import PropTypes from 'prop-types';

const stringDefaultEquals = (value1, value2) => ((value1 || '') === (value2 || ''));

class Input extends Component {
  static isFormInput = true;

  static propTypes = {
    allowLineBreaks: PropTypes.bool,
    className: PropTypes.string,
    convertEmptyStringToNull: PropTypes.bool,
    isReadOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    maxLength: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onChanging: PropTypes.func,
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
    onChange() {},
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

    const value = props.value || '';

    this.state = {
      initialValue: value,
      value,
    };
  }

  componentWillMount() {
    const { value } = this.state;
    this.handleChanging(value);
    this.handleChanged(value);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    const { value: stateValue } = this.state;
    const { value: nextValue } = nextProps;

    // Whenever a changed value prop comes in, and doesn't match our state,
    // and therefore was from outside this input, we reset state to that, thus becoming clean.
    if (!stringDefaultEquals(value, nextValue) && !stringDefaultEquals(stateValue, nextValue)) {
      this.setValue(nextValue, true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.state;
    const { value: prevValue } = prevState;

    if (!stringDefaultEquals(value, prevValue)) {
      this.handleChanging(value);
    }

    // We do not worry about whether value has changed when calling handleChanged
    // because it will do its own check against a different value. In fact, often
    // value will not differ from prevValue here because `value` tracks "changing"
    // rather than "changed".
    if (this.shouldCallChanged) {
      this.shouldCallChanged = false;
      this.handleChanged(value);
    }
  }

  onKeyPress = (event) => {
    const { onSubmit } = this.props;
    if (event.which === 13) onSubmit();
  };

  onBlur = (event) => {
    this.setValue(event.target.value, false);
  };

  onChange = (event) => {
    let { value } = event.target;
    value = value || '';
    this.setState({ value });
  };

  getValue() {
    return this.cleanValue(this.state.value);
  }

  setValue(value, shouldSetInitialValue) {
    value = value || '';

    this.shouldCallChanged = true;

    this.setState({ value });

    if (shouldSetInitialValue) {
      this.setState({ initialValue: value });
    }
  }

  cleanValue(value) {
    const { convertEmptyStringToNull, trimValue } = this.props;
    let outputValue = trimValue ? value.trim() : value;
    if (convertEmptyStringToNull && outputValue === '') outputValue = null;
    return outputValue;
  }

  resetValue() {
    this.setValue(this.props.value, true);
  }

  handleChanged(value) {
    const { onChange } = this.props;
    const outputValue = this.cleanValue(value);
    if (outputValue !== this.lastChangedValue) {
      this.lastChangedValue = outputValue;
      onChange(outputValue);
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
    const { initialValue, value } = this.state;
    return !stringDefaultEquals(value, initialValue);
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
