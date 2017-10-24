import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import SelectInput from './SelectInput';
import registerInputTests from '../../tests/registerInputTests';

const stringOptions = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
];

const numberOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
];

const booleanOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

// Run generic Input tests that should pass for any Composable Forms Spec input
registerInputTests({
  component: SelectInput,
  defaultValue: null,
  exampleValueOne: 'a',
  exampleValueTwo: 'b',
  mount,
  options: stringOptions,
  simulateChanging(wrapper, value) {
    wrapper.find('select').simulate('change', { target: { value } });
  },
  simulateChanged(wrapper, value) {
    wrapper.find('select').simulate('change', { target: { value } });
  },
});

// Test with number options
registerInputTests({
  component: SelectInput,
  defaultValue: null,
  exampleValueOne: 1,
  exampleValueTwo: 2,
  mount,
  options: numberOptions,
  simulateChanging(wrapper, value) {
    wrapper.find('select').simulate('change', { target: { value } });
  },
  simulateChanged(wrapper, value) {
    wrapper.find('select').simulate('change', { target: { value } });
  },
});

// Test with boolean options
registerInputTests({
  component: SelectInput,
  defaultValue: null,
  exampleValueOne: true,
  exampleValueTwo: false,
  mount,
  options: booleanOptions,
  simulateChanging(wrapper, value) {
    wrapper.find('select').simulate('change', { target: { value } });
  },
  simulateChanged(wrapper, value) {
    wrapper.find('select').simulate('change', { target: { value } });
  },
});

test('renders', () => {
  const component = renderer.create(
    <SelectInput name="test" options={stringOptions} />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
