import React from 'react';

// This function takes some config info allowing you to customize to the input being tested
// and then runs tests for it to be sure that it matches the Composable Forms Input Spec
export default function registerInputTests({
  component: Input,
  // Default and the three example values must all be different
  defaultValue,
  exampleValueOne,
  exampleValueTwo,
  mount,
  options,
  props,
  simulateChanging,
  simulateChanged,
  simulateSubmit,
}) {
  const inputName = Input.name;

  test(`${inputName} calls onChanging followed by onChanged before initial mount`, () => {
    const onChanging = jest.fn();
    const onChanged = jest.fn();

    mount(<Input name="test" onChanging={onChanging} onChanged={onChanged} options={options} {...props} />);

    expect(onChanging).toHaveBeenCalledTimes(1);
    expect(onChanged).toHaveBeenCalledTimes(1);

    expect(onChanging).toHaveBeenLastCalledWith(defaultValue);
    expect(onChanged).toHaveBeenLastCalledWith(defaultValue);
  });

  test(`${inputName} calls onChanging and onChanged`, () => {
    const onChanging = jest.fn();
    const onChanged = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChanged={onChanged} options={options} {...props} />);

    onChanging.mockClear();
    onChanged.mockClear();

    simulateChanging(wrapper, exampleValueOne);
    simulateChanged(wrapper, exampleValueOne);

    expect(onChanging).toHaveBeenCalledTimes(1);
    expect(onChanged).toHaveBeenCalledTimes(1);

    expect(onChanging).toHaveBeenLastCalledWith(exampleValueOne);
    expect(onChanged).toHaveBeenLastCalledWith(exampleValueOne);
  });

  if (simulateSubmit) {
    test(`${inputName} calls onSubmit`, () => {
      const onSubmit = jest.fn();

      const wrapper = mount(<Input name="test" onSubmit={onSubmit} options={options} {...props} />);
      simulateSubmit(wrapper);

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  }

  test(`${inputName} calls onChanging followed by onChanged when the value prop changes`, () => {
    const onChanging = jest.fn();
    const onChanged = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChanged={onChanged} value={exampleValueOne} options={options} {...props} />);

    wrapper.setProps({ value: exampleValueTwo });

    expect(onChanging).toHaveBeenCalledTimes(2);
    expect(onChanged).toHaveBeenCalledTimes(2);

    expect(onChanging.mock.calls[0][0]).toEqual(exampleValueOne);
    expect(onChanged.mock.calls[0][0]).toEqual(exampleValueOne);
    expect(onChanging.mock.calls[1][0]).toEqual(exampleValueTwo);
    expect(onChanged.mock.calls[1][0]).toEqual(exampleValueTwo);
  });

  test(`${inputName} getValue`, () => {
    const wrapper = mount(<Input name="test" value={exampleValueOne} options={options} {...props} />);
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

    wrapper.setProps({ value: exampleValueTwo });
    expect(wrapper.instance().getValue()).toEqual(exampleValueTwo);

    simulateChanging(wrapper, exampleValueOne);
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);
  });

  test(`${inputName} isDirty`, () => {
    const wrapper = mount(<Input name="test" value={exampleValueOne} options={options} {...props} />);
    expect(wrapper.instance().isDirty()).toBe(false);

    // Should only be true if changed by user rather than by prop
    wrapper.setProps({ value: exampleValueTwo });
    expect(wrapper.instance().isDirty()).toBe(false);

    simulateChanging(wrapper, exampleValueOne);
    expect(wrapper.instance().isDirty()).toBe(true);
  });

  test(`${inputName} resetValue works and calls onChanging and onChanged`, () => {
    const onChanging = jest.fn();
    const onChanged = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChanged={onChanged} value={exampleValueOne} options={options} {...props} />);
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

    simulateChanging(wrapper, exampleValueTwo);
    simulateChanged(wrapper, exampleValueTwo);
    expect(wrapper.instance().getValue()).toEqual(exampleValueTwo);

    onChanging.mockClear();
    onChanged.mockClear();

    wrapper.instance().resetValue();
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

    expect(onChanging).toHaveBeenCalledTimes(1);
    expect(onChanged).toHaveBeenCalledTimes(1);

    expect(onChanging).toHaveBeenLastCalledWith(exampleValueOne);
    expect(onChanged).toHaveBeenLastCalledWith(exampleValueOne);
  });
}
