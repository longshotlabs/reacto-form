import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { testInput } from 'composable-form-tests';
import BooleanCheckboxInput from './BooleanCheckboxInput';

// Run generic Input tests that should pass for any Composable Forms Spec input
testInput({
  component: BooleanCheckboxInput,
  defaultValue: false,
  exampleValueOne: true,
  exampleValueTwo: false,
  mount,
  props: { label: 'LABEL' },
  simulateChanged(wrapper, value) {
    wrapper.find('input').simulate('change', { target: { checked: !!value } });
  },
});

test('renders', () => {
  const component = renderer.create(
    <BooleanCheckboxInput name="test" label="LABEL" />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
