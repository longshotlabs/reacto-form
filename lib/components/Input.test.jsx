import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Input from './Input';
import registerInputTests from '../../tests/registerInputTests';

// Run generic Input tests that should pass for any Composable Forms Spec input
registerInputTests({
  component: Input,
  defaultValue: null,
  exampleValueOne: 'ONE',
  exampleValueTwo: 'TWO',
  mount,
  simulateChanging(wrapper, value) {
    wrapper.find('input').simulate('change', { target: { value } });
  },
  simulateChanged(wrapper, value) {
    wrapper.find('input').simulate('blur', { target: { value } });
  },
  simulateSubmit(wrapper) {
    wrapper.find('input').simulate('keypress', { which: 13 });
  },
});

test('renders', () => {
  const component = renderer.create(
    <Input name="test" />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders with props', () => {
  const component = renderer.create(
    <Input name="test" value="VALUE" placeholder="PLACEHOLDER" className="CLASSNAME" maxLength={20} style={{ color: '#000' }} isReadOnly />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders textarea', () => {
  const component = renderer.create(
    <Input name="test" allowLineBreaks />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders textarea with props', () => {
  const component = renderer.create(
    <Input name="test" allowLineBreaks value="VALUE" placeholder="PLACEHOLDER" className="CLASSNAME" maxLength={20} style={{ color: '#000' }} isReadOnly />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('getValue default trimming and null', () => {
  const wrapper = mount(<Input name="test" value=" " />);
  expect(wrapper.instance().getValue()).toBeNull();
});

test('getValue with convertEmptyStringToNull false', () => {
  const wrapper = mount(<Input name="test" convertEmptyStringToNull={false} />);
  expect(wrapper.instance().getValue()).toBe('');
});

test('getValue with trimValue false', () => {
  const wrapper = mount(<Input name="test" trimValue={false} value=" " />);
  expect(wrapper.instance().getValue()).toBe(' ');
});
