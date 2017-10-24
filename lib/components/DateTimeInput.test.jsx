import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import moment from 'moment-timezone';
import DateTimeInput from './DateTimeInput';
import getDateTimeValuesFromDate from '../shared/getDateTimeValuesFromDate';
import registerInputTests from '../../tests/registerInputTests';

const timezone = 'America/Chicago';

// Run generic Input tests that should pass for any Composable Forms Spec input
registerInputTests({
  component: DateTimeInput,
  defaultValue: null,
  exampleValueOne: new Date('2017-01-01T00:00:00.000'),
  exampleValueTwo: new Date('2017-01-02T00:00:00.000'),
  mount,
  props: { moment, timezone },
  simulateChanging(wrapper, value) {
    const { dayValue, monthValue, timeValue, yearValue } = getDateTimeValuesFromDate(value, moment, timezone);
    wrapper.find('select').simulate('change', { target: { value: monthValue } });
    wrapper.find('input').at(0).simulate('change', { target: { value: dayValue } });
    wrapper.find('input').at(1).simulate('change', { target: { value: yearValue } });
    wrapper.find('input').at(2).simulate('change', { target: { value: timeValue } });
  },
  simulateChanged(wrapper, value) {
    const { dayValue, monthValue, timeValue, yearValue } = getDateTimeValuesFromDate(value, moment, timezone);
    wrapper.find('select').simulate('change', { target: { value: monthValue } });
    wrapper.find('input').at(0).simulate('change', { target: { value: dayValue } });
    wrapper.find('input').at(1).simulate('change', { target: { value: yearValue } });
    wrapper.find('input').at(2).simulate('change', { target: { value: timeValue } });
    wrapper.find('input').at(2).simulate('blur');
  },
});

test('renders', () => {
  const component = renderer.create(
    <DateTimeInput name="test" moment={moment} />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
