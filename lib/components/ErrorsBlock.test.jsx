import React from 'react';
import renderer from 'react-test-renderer';
import ErrorsBlock from './ErrorsBlock';

test('has isComposableFormErrors property set to true', () => {
  expect(ErrorsBlock.isComposableFormErrors).toBe(true);
});

test('renders all error messages', () => {
  const errors = [
    { name: 'a', message: 'Message One' },
    { name: 'b', message: 'Message Two' },
  ];

  const component = renderer.create(
    <ErrorsBlock errors={errors} />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders nothing when there are no errors', () => {
  const component = renderer.create(
    <ErrorsBlock />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
