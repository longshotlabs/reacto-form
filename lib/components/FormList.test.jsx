import React from 'react';
import renderer from 'react-test-renderer';
import { Input } from 'reacto-form-inputs';
import Form from './Form';
import FormList from './FormList';

test('has isFormList property set to true', () => {
  expect(FormList.isFormList).toBe(true);
});

test('snapshot Input child', () => {
  const component = renderer.create(
    <FormList name="list" value={['VALUE', 'VALUE 2']}>
      <Input />
    </FormList>,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('snapshot Form child', () => {
  const component = renderer.create(
    <FormList name="list" value={[{ foo: { bar: 'VALUE' } }, { foo: { bar: 'VALUE2' } }]}>
      <Form>
        <Input name="foo.bar" />
      </Form>
    </FormList>,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('snapshot Input child - fixed count', () => {
  const component = renderer.create(
    <FormList name="list" value={['VALUE', 'VALUE 2']} minCount={2} maxCount={2}>
      <Input />
    </FormList>,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('snapshot Form child - fixed count', () => {
  const component = renderer.create(
    <FormList
      maxCount={2}
      minCount={2}
      name="list"
      value={[{ foo: { bar: 'VALUE' } }, { foo: { bar: 'VALUE2' } }]}
    >
      <Form>
        <Input name="foo.bar" />
      </Form>
    </FormList>,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
