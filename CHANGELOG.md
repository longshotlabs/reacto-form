# CHANGELOG

## Recent Releases

Release notes can be found at https://github.com/longshotlabs/reacto-form

## 1.5.1

Update `@babel/runtime` and `lodash` dependencies to their latest versions

## 1.5.0

Add support for MUI `Checkbox` along with examples of it in demo app.

## 1.4.2

Fix form `value` prop data getting lost after a successful submission.

## 1.4.1

Upgrade transitive dependencies to fix vulnerabilities

## 1.4.0

Both `form.submit()` and `form.validate()` now reliably return a Promise that resolves with the updated errors array. This allows you to await form submission and easily check the errors after.

## 1.3.0

- Update `Form` component to work with MUI in a way similar to `useReactoForm`
- Allow settings keys to `false` in `propNames` to omit those input props

## 1.2.0

- The `getInputProps` function returned by `useReactoForm` hook now returns a `hasBeenValidated` boolean prop.
- `useReactoForm` hook now includes `resetValue` in returned object.

## 1.1.0

Introduce React Hook: `useReactoForm`

## 1.0.0

Various non-breaking changes

## 0.0.1

Initial release
