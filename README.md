# reacto-form

ReactoForm package provides a `Form` React component that implements the [Composable Form Specification](http://composableforms.com/user/). This is the main component you need to take advantage of the spec if you are already using input components that conform to the spec.

This package also exports a `FormList` React component that implements the FormList spec. However, you may want to copy and customize this since it contains presentation markup and styles.

Another package, [reacto-form-inputs](https://github.com/DairyStateDesigns/reacto-form-inputs), provides examples of various types of inputs that conform to the spec. In general they are robust and production ready, but you may want to copy and modify them to style them to your needs. Alternatively, the ReactoForm `Form` component can be made to work with many popular React UI frameworks, and this is most likely what you want.

## Installation

```bash
npm i reacto-form
```

## Importing

### Recommended

Import CommonJS from `reacto-form/cjs/<ComponentName>`. Example, assuming you have Babel configured to convert all `import` to `require`:

```js
import Form from 'reacto-form/cjs/Form';
```

Import ECMAScript module from `reacto-form/esm/<ComponentName>`. Example:

```js
import Form from 'reacto-form/esm/Form';
```

### Alternative

You can also use named imports from the package entry point, but importing directly from the component path is recommended for minimizing bundle size.

```js
import { Form } from 'reacto-form';
```

## Example

See https://github.com/DairyStateDesigns/reacto-form-inputs#example

## Component Reference

### Form

Implements the [Form spec](spec/form.md).

In addition to following the spec, these props are supported:

- Use `style` or `className` props to help style the HTML form container, which is a DIV rather than a FORM.
- Set `logErrorsOnSubmit` to `true` to log validation errors to the console when submitting. This can help you figure out why your form isn't submitting if, for example, you forgot to include an ErrorsBlock somewhere so there is an error not shown to the user.

[Usage](http://composableforms.com/user/form/)

### FormList

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
