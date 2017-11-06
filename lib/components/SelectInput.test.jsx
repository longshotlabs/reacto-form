import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { testInput } from 'composable-form-tests';
import SelectInput from './SelectInput';

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
testInput({
  component: SelectInput,
  defaultValue: null,
  exampleValueOne: 'a',
  exampleValueTwo: 'b',
  mount,
  options: stringOptions,
  simulateChanged(wrapper, value) {
    wrapper.find('select').simulate('change', { target: { value } });
  },
});

// Test with number options
testInput({
  component: SelectInput,
  defaultValue: null,
  exampleValueOne: 1,
  exampleValueTwo: 2,
  mount,
  options: numberOptions,
  simulateChanged(wrapper, value) {
    wrapper.find('select').simulate('change', { target: { value } });
  },
});

// Test with boolean options
testInput({
  component: SelectInput,
  defaultValue: null,
  exampleValueOne: true,
  exampleValueTwo: false,
  mount,
  options: booleanOptions,
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
