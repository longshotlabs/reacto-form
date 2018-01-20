import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';

import customPropTypes from '../shared/propTypes';
import getDateTimeValuesFromDate from '../shared/getDateTimeValuesFromDate';
import getDateFromDateTimeValues from '../shared/getDateFromDateTimeValues';

const styles = {
  dayInput: {
    display: 'inline-block',
    marginRight: 5,
    verticalAlign: 'middle',
    width: '5rem',
  },
  monthSelect: {
    display: 'inline-block',
    marginRight: 5,
    verticalAlign: 'middle',
    width: 'auto',
  },
  timeInput: {
    display: 'inline-block',
    marginRight: 5,
    verticalAlign: 'middle',
    width: '15rem',
  },
  yearInput: {
    display: 'inline-block',
    marginRight: 5,
    verticalAlign: 'middle',
    width: '7rem',
  },
};

class DateTimeInput extends Component {
  static isFormInput = true;

  static propTypes = {
    ...customPropTypes.inputs,
    className: PropTypes.string,
    dayInputClassName: PropTypes.string,
    dayInputStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    moment: PropTypes.func.isRequired,
    monthSelectClassName: PropTypes.string,
    monthSelectStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    timeInputClassName: PropTypes.string,
    timeInputStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    timezone: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    yearInputClassName: PropTypes.string,
    yearInputStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    className: undefined,
    dayInputClassName: undefined,
    dayInputStyle: {},
    isReadOnly: false,
    monthSelectClassName: undefined,
    monthSelectStyle: {},
    name: undefined,
    onChange() {},
    onChanging() {},
    placeholder: undefined,
    style: {},
    timeInputClassName: undefined,
    timeInputStyle: {},
    timezone: undefined,
    type: 'text',
    value: undefined,
    yearInputClassName: undefined,
    yearInputStyle: {},
  };

  constructor(props) {
    super(props);

    this.state = getDateTimeValuesFromDate(props.value, props.moment, props.timezone);
  }

  componentWillMount() {
    this.handleChange({}, true);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    const { value: nextValue } = nextProps;

    // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
    if (!isEqual(value, nextValue)) {
      const { moment, timezone } = nextProps;
      this.handleChange(getDateTimeValuesFromDate(nextValue, moment, timezone), true);
    }
  }

  onChangingDay = (event) => {
    let { value: dayValue } = event.target;
    if (typeof dayValue === 'string') dayValue = dayValue.trim();
    this.handleChange({ dayValue }, false);
  };

  onChangingYear = (event) => {
    let { value: yearValue } = event.target;
    if (typeof yearValue === 'string') yearValue = yearValue.trim();
    this.handleChange({ yearValue }, false);
  };

  onChangingTime = (event) => {
    let { value: timeValue } = event.target;
    if (typeof timeValue === 'string') timeValue = timeValue.trim();
    this.handleChange({ timeValue }, false);
  };

  onChangedDay = (event) => {
    let { value: dayValue } = event.target;
    if (typeof dayValue === 'string') dayValue = dayValue.trim();
    this.handleChange({ dayValue }, true);
  };

  onChangedYear = (event) => {
    let { value: yearValue } = event.target;
    if (typeof yearValue === 'string') yearValue = yearValue.trim();
    this.handleChange({ yearValue }, true);
  };

  onChangedTime = (event) => {
    let { value: timeValue } = event.target;
    if (typeof timeValue === 'string') timeValue = timeValue.trim();
    this.handleChange({ timeValue }, true);
  };

  onChangeMonth = (event) => {
    const { value: monthValue } = event.target;
    this.handleChange({ monthValue }, true);
  };

  getValue() {
    const { moment, timezone } = this.props;
    return getDateFromDateTimeValues(this.state, moment, timezone);
  }

  setValue(value) {
    const { moment, timezone } = this.props;
    this.handleChange(getDateTimeValuesFromDate(value, moment, timezone), true);
  }

  resetValue() {
    this.setValue(this.props.value);
  }

  handleChange(stateChanges, isChanged) {
    const { moment, timezone, onChanging, onChange } = this.props;
    if (!isEmpty(stateChanges)) this.setState(stateChanges);
    const date = getDateFromDateTimeValues({
      ...this.state,
      ...stateChanges,
    }, moment, timezone);
    if (!isEqual(date, this.lastChangingValue)) {
      this.lastChangingValue = date;
      onChanging(date);
    }
    if (isChanged && !isEqual(date, this.lastChangedValue)) {
      this.lastChangedValue = date;
      onChange(date);
    }
  }

  // Input is dirty if value prop doesn't match value state. Whenever a changed
  // value prop comes in, we reset state to that, thus becoming clean.
  isDirty() {
    const { moment, timezone, value } = this.props;
    return !isEqual(this.state, getDateTimeValuesFromDate(value, moment, timezone));
  }

  render() {
    const {
      className,
      dayInputClassName,
      dayInputStyle,
      isReadOnly,
      monthSelectClassName,
      monthSelectStyle,
      style,
      timeInputClassName,
      timeInputStyle,
      yearInputClassName,
      yearInputStyle,
    } = this.props;
    const { dayValue, monthValue, timeValue, yearValue } = this.state;

    return (
      <div className={className} style={style}>
        <select
          className={monthSelectClassName}
          onChange={this.onChangeMonth}
          readOnly={isReadOnly}
          style={{ ...styles.monthSelect, monthSelectStyle }}
          value={monthValue}
        >
          <option value="">--- Month ---</option>
          <option value="1">January (1)</option>
          <option value="2">February (2)</option>
          <option value="3">March (3)</option>
          <option value="4">April (4)</option>
          <option value="5">May (5)</option>
          <option value="6">June (6)</option>
          <option value="7">July (7)</option>
          <option value="8">August (8)</option>
          <option value="9">September (9)</option>
          <option value="10">October (10)</option>
          <option value="11">November (11)</option>
          <option value="12">December (12)</option>
        </select>
        <input
          className={dayInputClassName}
          onBlur={this.onChangedDay}
          onChange={this.onChangingDay}
          readOnly={isReadOnly}
          style={{ ...styles.dayInput, ...dayInputStyle }}
          type="text"
          placeholder="DD"
          value={dayValue}
        />
        <input
          className={yearInputClassName}
          onBlur={this.onChangedYear}
          onChange={this.onChangingYear}
          readOnly={isReadOnly}
          style={{ ...styles.yearInput, ...yearInputStyle }}
          type="text"
          placeholder="YYYY"
          value={yearValue}
        />
        <input
          className={timeInputClassName}
          onBlur={this.onChangedTime}
          onChange={this.onChangingTime}
          readOnly={isReadOnly}
          style={{ ...styles.timeInput, ...timeInputStyle }}
          type="time"
          placeholder="HH:MM"
          value={timeValue}
        />
      </div>
    );
  }
}

export default DateTimeInput;
