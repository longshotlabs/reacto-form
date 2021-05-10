# NPM: reacto-form

> This repository is maintained by [Long Shot Labs](https://www.longshotlabs.co/). Please consider [financially supporting our mission](https://github.com/sponsors/longshotlabs) to provide useful and supported code packages to the world.

![NPM](https://img.shields.io/npm/l/reacto-form?style=for-the-badge)

[![npm](https://img.shields.io/npm/v/reacto-form?style=for-the-badge)](https://www.npmjs.com/package/reacto-form)

![node-current](https://img.shields.io/node/v/reacto-form?style=for-the-badge)

![npm bundle size](https://img.shields.io/bundlephobia/min/reacto-form?style=for-the-badge)

[![Lint, Test, and (Maybe) Publish](https://github.com/longshotlabs/reacto-form/actions/workflows/lint-test-publish.yml/badge.svg)](https://github.com/longshotlabs/reacto-form/actions/workflows/lint-test-publish.yml)

The `reacto-form` NPM package exports a React form state manager hook (`useReactoForm`) designed to work with many popular form UI frameworks.

Why should you use this instead of managing form state on your own? For a single input, managing state on your own is usually simple and desirable. But as a form grows in size and complexity, the number of things you need to consider and handle grows exponentially.

- When should you initially validate each field?
- When should you revalidate each field after the first time?
- Where and when should you show field validation errors?
- When should you reset a form's values or validation error state?
- How can you update field styles based on validity?
- When should the submit button be enabled or disabled?

If you're building a form and have some of these questions, `reacto-form` may be what you need.

## Features

- Modern hook-based form state management
- Actions are asynchronous with a Promise-based API
- Works with or without external form state: you choose whether to pass in an initial value for the form, and update it as necessary to reset form fields
- No dependencies on external state management packages like Redux or MobX
- Works with any UI framework or none
- Works with any validation library or none
- Reactive display of error messages
- Translation friendly

## Install

```sh
npm install reacto-form
```

## Use

Call the hook in your component function, passing options, and then use the returned functions to inject the proper form logic into all of your input components as standard props.

Here's the simplest possible example, using [SimpleSchema](https://github.com/aldeed/simple-schema-js) to create the validator function and [Material UI](https://material-ui.com/) for the inputs. (But you can use any form components and any validation library.)

```js
import React from "react";
import { 
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField
} from "@material-ui/core";
import { muiCheckboxOptions, muiOptions, useReactoForm } from "reacto-form";
import SimpleSchema from "simpl-schema";

const formSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 4,
  },
  lastName: {
    type: String,
    min: 2,
  },
  isMarried: {
    type: Boolean,
    optional: true,
  },
});
const validator = formSchema.getFormValidator();

const onSubmit = (formData) => {
  console.log("onSubmitForm", formData);
};

export default function ReactoFormHookExampleMUI() {
  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm,
  } = useReactoForm({
    onSubmit,
    validator,
  });

  return (
    <form novalidate>
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
          control={<Checkbox color="primary" />}
          label="Are you married?"
          {...getInputProps("isMarried", muiCheckboxOptions)}
        />
      </FormGroup>
      <Button onClick={submitForm}>Submit</Button>
    </form>
  );
}
```

## API

### useReactoForm Hook

```js
const { /* UseReactoFormState */ } = useReactoForm({ /* UseReactoFormProps */ })
```

#### UseReactoFormProps

| Property                  | Definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hasBeenValidated`        | Pass a boolean to override the internal tracking of whether the `validator` function has been called since the form was created or reset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `isReadOnly`              | Pass a boolean or a function that accepts the current form data object as its only argument and returns a boolean. If `true`, all inputs controlled by the form will be in read-only mode (disabled). ReactoForm also automatically makes all of the inputs read only while the form is being submitted.                                                                                                                                                                                                                                                                                                                                                                                  |
| `logErrorsOnSubmit`       | Pass `true` to log all errors in the console when `submitForm` is called, if there are any errors. This can be helpful during initial development and when debugging in case you have forgotten to show any errors in the UI.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `onChange`                | This function will be called with the new form data object whenever any input changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `onChanging`              | This function will be called with the new form data object whenever any input is in the process of changing (for example, while a slider is moving but not yet released, while a finger is moving but not yet lifted, while a user is typing but hasn't yet tabbed to the next field).                                                                                                                                                                                                                                                                                                                                                                                                    |
| `onSubmit`                | This function will be called with the form data object when you call `submitForm`, if the form is valid or `shouldSubmitWhenInvalid` is `true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `revalidateOn`            | Set this to "changing", "changed", or "submit". The default is "changing". This determines how often `validator` will be called (thus reactively updating `errors`) when `hasBeenValidated` is `true`. When `hasBeenValidated` is `false`, then the `validateOn` setting is used.<br/><br/>Note that these are additive; "changing" causes validation before `onChanging` is called, before `onChange` is called, AND before `onSubmit` is called; "changed" causes validation before `onChange` is called AND before `onSubmit` is called; "submit" causes validation only before `onSubmit` is called.<br/><br/>If you don't need validation, simply don't pass a `validator` function. |
| `shouldSubmitWhenInvalid` | Normally `onSubmit` will not be called if `validator` returns any errors. To override this and call `onSubmit` anyway, set this option to `true`. The second argument passed to `onSubmit` will be an `isValid` boolean.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `validateOn`              | Set this to "changing", "changed", or "submit". The default is "changing". This determines how often `validator` will be called (thus reactively updating `errors`) when `hasBeenValidated` is `true`. When `hasBeenValidated` is `false`, then the `validateOn` setting is used.<br/><br/>Note that these are additive; "changing" causes validation before `onChanging` is called, before `onChange` is called, AND before `onSubmit` is called; "changed" causes validation before `onChange` is called AND before `onSubmit` is called; "submit" causes validation only before `onSubmit` is called.<br/><br/>If you don't need validation, simply don't pass a `validator` function. |
| `validator`               | This is the validation function. Use any validation library you want as long as you return an errors array with [this structure](http://composableforms.com/spec/errors/#errors), or a Promise that resolves with such an array.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `value`                   | The current form data. (Usually an object.) Pass this for an update form or to provide default values for some of the inputs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

#### UseReactoFormState

| Property               | Definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `formData`             | The current form data object. This initially matches the `value` you provide but changes as the user fills out the form. If you call `resetValue`, this will once again match the `value` you provide.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `getErrors`            | A function that returns an errors array like this: http://composableforms.com/spec/errors/#errors. The signature is `(fieldPaths, { includeDescendantErrors = false } = {})`. `fieldPaths` is an array of object paths. `includeDescendantErrors` would for example include an error for `"address.city"` when `fieldPaths` is `["address"]`.                                                                                                                                                                                                                                                                                                                                                                      |
| `getFirstError`        | A function similar to `getErrors` but returns only the first error matching any field path, or `null` if there are none. The signature is `(fieldPaths, { includeDescendantErrors = false } = {})`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `getFirstErrorMessage` | A function similar to `getFirstError` but returns only the first error message string matching any field path, or `null` if there are none. The signature is `(fieldPaths, { includeDescendantErrors = false } = {})`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `getInputProps`        | A function that returns a props object that conforms to the [Composable Form Input Specification](http://composableforms.com/user/input/). Pass a unique field path string as the first argument. For example, `getInputProps("email")` will return input props that result in the form data object `{ email: "" }` while `getInputProps("address.city")` will return input props that result in the form data object `{ address: { city: "" } }`. If you are using a compliant input component, simply pass the returned props to that input and everything will be wired up for you. If you are using a non-compliant input component, you may still be able to make it work. See the Material UI example below. |
| `hasBeenValidated`     | Boolean indicating whether `validator` has been called since the form was created or since `resetValue` was last called.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `hasErrors`            | A function similar to `getErrors` but returns only `true` if there are any errors or `false` if not. The signature is `(fieldPaths, { includeDescendantErrors = false } = {})`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `isDirty`              | This will be `true` if the form data state has changed from the initial form `value` (i.e. if the user has changed any inputs).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `resetValue`           | Call this function to reset `formData` to `value`, thus causing `isDirty` to be `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `submitForm`           | Call this function to validate and submit all inputs (i.e., to call `validator` followed by `onSubmit`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## Contributing

[How you can help](./CONTRIBUTING.md)

### NPM Scripts

```sh
# Confirm that all TypeScript is valid and run all ESLint checks
# This happens automatically on `npm publish`
npm run lint
npm run lint -- --quiet # only errors, no warnings
npm run lint -- --fix # auto-fix any lint errors if possible

# Use TypeScript compiler to create JS files in `/build`
# This happens automatically on `npm publish`
npm run build 

# Delete the whole `build` folder. This happens automatically on `npm run build` and `npm run watch` commands
npm run clean

# Use TypeScript compiler to create JS files in `/build`, and
# then watch for changes and re-build
npm run watch

# Run all tests
npm test

# Build the package and publish it to NPM (if you have permission)
# Be sure to run `npm run lint && npm test` right before doing this
npm publish
```
