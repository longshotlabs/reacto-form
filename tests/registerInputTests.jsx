import React from 'react';

// This function takes some config info allowing you to customize to the input being tested
// and then runs tests for it to be sure that it matches the Composable Forms Input Spec
export default function registerInputTests({
  component: Input,
  // exampleValueOne must be different from defaultValue && exampleValueTwo, but
  // defaultValue && exampleValueTwo may be the same
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

    // Inputs need not have a way of "changing" but must call only onChanging
    // and not onChanged if they do.
    if (typeof simulateChanging === 'function') {
      simulateChanging(wrapper, exampleValueOne);
      expect(onChanging).toHaveBeenCalledTimes(1);
      expect(onChanging).toHaveBeenLastCalledWith(exampleValueOne);
      expect(onChanged).toHaveBeenCalledTimes(0);
    }

    simulateChanged(wrapper, exampleValueOne);
    expect(onChanged).toHaveBeenCalledTimes(1);
    expect(onChanged).toHaveBeenLastCalledWith(exampleValueOne);
  });

  if (typeof simulateSubmit === 'function') {
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

    simulateChanged(wrapper, exampleValueOne);
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);
  });

  test(`${inputName} isDirty`, () => {
    const wrapper = mount(<Input name="test" value={exampleValueOne} options={options} {...props} />);
    expect(wrapper.instance().isDirty()).toBe(false);

    // Should only be true if changed by user rather than by prop
    wrapper.setProps({ value: exampleValueTwo });
    expect(wrapper.instance().isDirty()).toBe(false);

    simulateChanged(wrapper, exampleValueOne);
    expect(wrapper.instance().isDirty()).toBe(true);
  });

  test(`${inputName} resetValue works and calls onChanging and onChanged`, () => {
    const onChanging = jest.fn();
    const onChanged = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChanged={onChanged} value={exampleValueOne} options={options} {...props} />);
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

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

  test(`${inputName} setValue works and calls onChanging and onChanged`, () => {
    const onChanging = jest.fn();
    const onChanged = jest.fn();

    const wrapper = mount(<Input name="test" onChanging={onChanging} onChanged={onChanged} value={exampleValueOne} options={options} {...props} />);
    expect(wrapper.instance().getValue()).toEqual(exampleValueOne);

    onChanging.mockClear();
    onChanged.mockClear();

    wrapper.instance().setValue(exampleValueTwo);
    expect(wrapper.instance().getValue()).toEqual(exampleValueTwo);
    expect(wrapper.instance().isDirty()).toBe(true);

    expect(onChanging).toHaveBeenCalledTimes(1);
    expect(onChanged).toHaveBeenCalledTimes(1);

    expect(onChanging).toHaveBeenLastCalledWith(exampleValueTwo);
    expect(onChanged).toHaveBeenLastCalledWith(exampleValueTwo);
  });
}
