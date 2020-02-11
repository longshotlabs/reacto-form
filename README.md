# reacto-form

This package is a very lightweight implementation of a form handler that works with React input based on the [Composable Form Specification](http://composableforms.com/user/). ReactoForm works best with inputs that fully implement this specification, but it can be adjusted to work with most React form input components that are at least similar to the specification.

This package exports the following things that help you quickly combine, validate, and submit form data collected by React input components:

- `useReactoForm` React hook (preferred)
- `Form` React component (in case you're stuck with a class component)

Additionally, it exports a `FormList` React component that is an example of building a dynamic array from form inputs.

Another package, [reacto-form-inputs](https://github.com/DairyStateDesigns/reacto-form-inputs), provides examples of various types of inputs that conform to the spec. In general they are robust, tested, and production ready, but you may want to copy and modify them to style them to your needs. Alternatively, ReactoForm can be made to work with many popular React UI frameworks, and this is most likely what you want to do with this package.

## Installation

```bash
npm i reacto-form
```

## Importing

### Recommended

Import CommonJS from `reacto-form/cjs/<ComponentName>`. Example, assuming you have Babel configured to convert all `import` to `require`:

```js
import Form from 'reacto-form/cjs/Form';
import FormList from 'reacto-form/cjs/FormList';
import useReactoForm from 'reacto-form/cjs/useReactoForm';
```

Import ECMAScript module from `reacto-form/esm/<ComponentName>`. Example:

```js
import Form from 'reacto-form/esm/Form';
import FormList from 'reacto-form/esm/FormList';
import useReactoForm from 'reacto-form/esm/useReactoForm';
```

### Alternative

You can also use named imports from the package entry point, but this may result in a larger bundle size versus importing directly from the component path.

```js
import { Form, FormList, useReactoForm } from 'reacto-form';
```

## Example

See https://github.com/DairyStateDesigns/reacto-form-inputs#example

## Demo App

```bash
cd demo-app
npm start
```

## useReactoForm Hook

_Available since v1.2.0_

The newest and best way to use ReactoForm is with the aptly named `useReactoForm` React hook. Unless your form is in a class component, where React hooks don't work, you should always use this hook. For class components, use the `Form` component described below.

In a nutshell, you call the hook in your component function, passing options, and then use the returned functions to inject the proper form logic into all of your input components as standard props.

Here's the simplest possible example, using [SimpleSchema](https://github.com/aldeed/simple-schema-js) to create the validator function. You could choose to write your own validation function or use any validation package you like, with a small wrapper to adjust the errors structure if necessary.

```js
import React from "react";
import Button from '@material-ui/core/Button';
import { ErrorsBlock, Field, Input } from "reacto-form-inputs";
import useReactoForm from "reacto-form/esm/useReactoForm";
import SimpleSchema from "simpl-schema";

const formSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 4
  },
  lastName: {
    type: String,
    min: 2
  }
});

const validator = formSchema.getFormValidator();

export default function ReactoFormHookExample() {
  // Here we call the hook function. None of the options are required, but in general
  // you would always want a `validator` function and an `onSubmit` function.
  const {
    getErrors,
    getInputProps,
    submitForm,
  } = useReactoForm({
    onChange: (formData) => { console.log("onChangeForm", formData); },
    onChanging: (formData) => { console.log("onChangingForm", formData); },
    onSubmit: (formData) => { console.log("onSubmitForm", formData); },
    validator,
    // value - optionally pass an object representing the current form data, if it's an update form or has default values
  });

  return (
    /* Note that we need not wrap our fields in <form>, or really in anything */
    <div>
      /* We can use `getErrors` to get all of the errors related to one or more fields, based on the field path */
      <Field name="firstName" errors={getErrors(["firstName"])} label="First name">
        /* We can use `getInputProps` to get all props for a single field path */
        <Input {...getInputProps("firstName")} />
        <ErrorsBlock errors={getErrors(["firstName"])} />
      </Field>
      <Field name="lastName" errors={getErrors(["lastName"])} label="Last name">
        <Input {...getInputProps("lastName")} />
        <ErrorsBlock errors={getErrors(["lastName"])} />
      </Field>
      /* The submit action must call the `submitForm` function that `useReactoForm` returned */
      <Button onClick={submitForm}>Submit</Button>
    </div>
  );
}
```

Here's a full list of what you can pass to `useReactoForm`:

- `hasBeenValidated`: Pass a boolean to override the internal tracking of whether the `validator` function has been called since the form was created or reset.
- `logErrorsOnSubmit`: Pass `true` to log all errors in the console when `submitForm` is called, if there are any errors. This can be helpful during initial development and when debugging in case you have forgotten to show any errors in the UI.
- `onChange`: This function will be called with the new form data object whenever any input changes
- `onChanging`: This function will be called with the new form data object whenever any input is in the process of changing (for example, while a slider is moving but not yet released, while a finger is moving but not yet lifted, while a user is typing but hasn't yet tabbed to the next field).
- `onSubmit`: This function will be called with the form data object when you call `submitForm`, if the form is valid or `shouldSubmitWhenInvalid` is `true`.
- `revalidateOn`: Set this to "changing", "changed", or "submit". The default is "changing". This determines how often `validator` will be called (thus reactively updating `errors`) when `hasBeenValidated` is `true`. When `hasBeenValidated` is `false`, then the `validateOn` setting is used.
  - Note that these are additive; "changing" causes validation before `onChanging` is called, before `onChange` is called, AND before `onSubmit` is called; "changed" causes validation before `onChange` is called AND before `onSubmit` is called; "submit" causes validation only before `onSubmit` is called.
  - If you don't need validation, simply don't pass a `validator` function.
- `shouldSubmitWhenInvalid`: Normally `onSubmit` will not be called if `validator` returns any errors. To override this and call `onSubmit` anyway, set this option to `true`. The second argument passed to `onSubmit` will be an `isValid` boolean.
- `validateOn`: Set this to "changing", "changed", or "submit". The default is "submit". This determines how often `validator` will be called (thus reactively updating `errors`) when `hasBeenValidated` is `false`. When `hasBeenValidated` is `true`, then the `revalidateOn` setting is used.
  - Note that these are additive; "changing" causes validation before `onChanging` is called, before `onChange` is called, AND before `onSubmit` is called; "changed" causes validation before `onChange` is called AND before `onSubmit` is called; "submit" causes validation only before `onSubmit` is called.
  - If you don't need validation, simply don't pass a `validator` function.
- `validator`: This is the validation function. Use any validation library you want as long as you return an errors array with [this structure](http://composableforms.com/spec/errors/#errors), or a Promise that resolves with such an array.
- `value`: The current form data. Pass this for an update form or to provide default values for some of the inputs.

Here's a full list of what you can get from the object returned by `useReactoForm`:

- `getInputProps`: A function that returns a props object that conforms to the [Composable Form Input Specification](http://composableforms.com/user/input/). Pass a unique field path string as the first argument. For example, `getInputProps("email")` will return input props that result in the form data object `{ email: "" }` while `getInputProps("address.city")` will return input props that result in the form data object `{ address: { city: "" } }`. If you are using a compliant input component, simply pass the returned props to that input and everything will be wired up for you. If you are using a non-compliant input component, you may still be able to make it work. See the Material UI example below.
- `formData`: The current form data object. This initially matches the `value` you provide but changes as the user fills out the form. If you call `resetValue`, this will once again match the `value` you provide.
- `getErrors`: A function that returns an errors array like this: http://composableforms.com/spec/errors/#errors. The signature is `(fieldPaths, { includeDescendantErrors = false } = {})`. `fieldPaths` is an array of object paths. `includeDescendantErrors` would for example include an error for `"address.city"` when `fieldPaths` is `["address"]`.
- `getFirstError`: A function similar to `getErrors` but returns only the first error matching any field path, or `null` if there are none. The signature is `(fieldPaths, { includeDescendantErrors = false } = {})`.
- `getFirstErrorMessage`: A function similar to `getFirstError` but returns only the first error message string matching any field path, or `null` if there are none. The signature is `(fieldPaths, { includeDescendantErrors = false } = {})`.
- `hasBeenValidated`: Boolean indicating whether `validator` has been called since the form was created or since `resetValue` was last called.
- `hasErrors`: A function similar to `getErrors` but returns only `true` if there are any errors or `false` if not. The signature is `(fieldPaths, { includeDescendantErrors = false } = {})`.
- `isDirty`: This will be `true` if the form data state has changed from the initial form `value` (i.e. if the user has changed any inputs).
- `resetValue`: Call this function to reset `formData` to `value`, thus causing `isDirty` to be `false`.
- `submitForm`: Call this function to validate and submit all inputs (i.e., to call `validator` followed by `onSubmit`).

### useReactoForm Hook with non-compliant inputs (Material UI example)

Material UI is a great framework, but unfortunately the React input components do not currently match the [Composable Form Input Specification](http://composableforms.com/user/input/) in several ways. For example, the [TextField](https://material-ui.com/api/text-field/) has the following differences:

- It complains when you pass `null` as `value`, and it considers the input to be "uncontrolled" when you pass `undefined` as `value`. Instead, it expects an empty string.
- `onChange` is called while changing, `onBlur` is called after the change, and `onChanging` is never called and causes a console warning.
- `isReadOnly` prop is named `disabled`

Fortunately, the `useReactoForm` `getInputProps` function takes some options which allow us to change the names of the returned props, omit returned props, and convert `null` value to some other value:

```js
getInputProps("email", {
  nullValue: '',
  onChangeGetValue: event => event.target.value,
  onChangingGetValue: event => event.target.value,
  propNames: {
    errors: false,
    hasBeenValidated: false,
    isReadOnly: 'disabled',
    onChange: 'onBlur',
    onChanging: 'onChange',
    onSubmit: false,
  },
});
```

To simplify this further, this package exports these options as `muiOptions`:

```js
import muiOptions from "reacto-form/esm/muiOptions";

getInputProps("email", muiOptions);
```

Similarly, you can import `muiCheckboxOptions` for an MUI `Checkbox` component:

```js
import muiOptions from "reacto-form/esm/muiCheckboxOptions";

getInputProps("isMarried", muiCheckboxOptions);
```

Here's a full example:

```js
import React from "react";
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import muiCheckboxOptions from "reacto-form/esm/muiCheckboxOptions";
import muiOptions from "reacto-form/esm/muiOptions";
import useReactoForm from "reacto-form/esm/useReactoForm";
import SimpleSchema from "simpl-schema";

const formSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 4
  },
  lastName: {
    type: String,
    min: 2
  }
});

const onSubmit = (formData) => { console.log("onSubmitForm", formData); }
const validator = formSchema.getFormValidator();

export default function ReactoFormHookExampleMUI() {
  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    onSubmit,
    validator,
  });

  return (
    <div>
      <TextField
        label="First name"
        error={hasErrors(["firstName"])}
        fullWidth
        helperText={getFirstErrorMessage(["firstName"])}
        {...getInputProps("firstName", muiOptions)}
      />
      <TextField
        label="Last name"
        error={hasErrors(["lastName"])}
        fullWidth
        helperText={getFirstErrorMessage(["lastName"])}
        {...getInputProps("lastName", muiOptions)}
      />
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox color="primary" />
          }
          label="Are you married?"
          {...getInputProps("isMarried", muiCheckboxOptions)}
        />
      </FormGroup>
      <Button onClick={submitForm}>Submit</Button>
    </div>
  );
}
```

## Form Component

Implements the [Form spec](spec/form.md).

In addition to following the spec, these props are supported:

- Use `style` or `className` props to help style the HTML form container, which is a DIV rather than a FORM.
- Set `logErrorsOnSubmit` to `true` to log validation errors to the console when submitting. This can help you figure out why your form isn't submitting if, for example, you forgot to include an ErrorsBlock somewhere so there is an error not shown to the user.

[Usage](http://composableforms.com/user/form/)

### Using Form with non-compliant inputs (Material UI example)

_Works in 1.3.0+_

Material UI is a great framework, but unfortunately the React input components do not currently match the [Composable Form Input Specification](http://composableforms.com/user/input/) in several ways. For example, the [TextField](https://material-ui.com/api/text-field/) has the following differences:

- It complains when you pass `null` as `value`, and it considers the input to be "uncontrolled" when you pass `undefined` as `value`. Instead, it expects an empty string.
- `onChange` is called while changing, `onBlur` is called after the change, and `onChanging` is never called and causes a console warning.
- `isReadOnly` prop is named `readOnly`

Fortunately, the `Form` component takes some options in the `inputOptions` props which allow us to change the names of the returned props, omit returned props, and convert `null` value to some other value:

```js
const inputOptions = {
  nullValue: '',
  propNames: {
    errors: false,
    hasBeenValidated: false,
    isReadOnly: 'readOnly',
    onChange: 'onBlur',
    onChanging: 'onChange',
    onSubmit: false,
  },
};

<Form inputOptions={inputOptions}>
  /* MUI inputs */
</Form>
```

To simplify this further, this package exports these options as `muiOptions`:

```js
import muiOptions from "reacto-form/esm/muiOptions";

<Form inputOptions={muiOptions}>
  /* MUI inputs */
</Form>
```

Here's a full example:

```js
import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Form from "reacto-form/esm/Form";
import muiOptions from "reacto-form/esm/muiOptions";
import SimpleSchema from "simpl-schema";

const formSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 4
  },
  lastName: {
    type: String,
    min: 2
  }
});

const onSubmit = (formData) => { console.log("onSubmitForm", formData); }
const validator = formSchema.getFormValidator();

export default function ReactoFormExampleMUI() {
  const formRef = useRef(null);

  return (
    <div>
      <Form
        inputOptions={muiOptions}
        onSubmit={onSubmit}
        ref={formRef}
        validator={validator}
      >
        <TextField
          error={formRef.current && formRef.current.hasErrors(["firstName"])}
          fullWidth
          helperText={formRef.current && formRef.current.getFirstErrorMessage(["firstName"])}
          label="First name"
          name="firstName"
        />
        <TextField
          error={formRef.current && formRef.current.hasErrors(["lastName"])}
          fullWidth
          helperText={formRef.current && formRef.current.getFirstErrorMessage(["lastName"])}
          label="Last name"
          name="lastName"
        />
        <Button
          onClick={() => formRef.current && formRef.current.submit()}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
```

## FormList Component

Implements the [FormList spec](spec/list.md).

This implementation appears as a list with the item template on the right and remove buttons on the left, plus a final row with an add button in it.

In addition to following the spec, you can use the following props to help style the component:

- addButtonText: String to use as the text of the add button. Default "+"
- addItemRowStyle: Style object for the row after the last item, where the add button is
- buttonClassName: String of space-delimited classes to use on the add and remove buttons
- buttonStyle: Style object for the add and remove buttons
- className: String of space-delimited classes to use on the list container
- itemAreaClassName: String of space-delimited classes to use on the inner container of each item
- itemAreaStyle: Style object for the inner container of each item
- itemClassName: String of space-delimited classes to use on the outer container of each item
- itemStyle: Style object for the outer container of each item
- itemRemoveAreaClassName: String of space-delimited classes to use on the remove button area of each item
- itemRemoveAreaStyle: Style object for the remove button area of each item
- removeButtonText: String to use as the text of the remove buttons. Default "–"
- style: Style object for the list container

If you want a different add/remove experience that can't be achieved with classes or styles, then you'll need to make your own implementation of FormList.

[Usage](http://composableforms.com/user/list/)
