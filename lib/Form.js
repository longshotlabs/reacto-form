import React, { Component } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import set from "lodash/set";
import unset from "lodash/unset";
import clone from "clone";

import bracketsToDots from "./shared/bracketsToDots";
import customPropTypes from "./shared/propTypes";
import filterErrorsForNames from "./shared/filterErrorsForNames";
import recursivelyCloneElements from "./shared/recursivelyCloneElements";

// To ensure we do not mutate objects passed in, we'll do a deep clone.
function cloneValue(value) {
  return value ? clone(value) : {};
}

class Form extends Component {
  static isForm = true;

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      hasBeenValidated: false,
      value: cloneValue(props.value),
    };

    this.elementRefs = [];
  }

  componentDidMount() {
    this._isMounted = true;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { hasBeenValidated, value } = this.props;
    const {
      hasBeenValidated: hasBeenValidatedNext,
      value: nextValue,
    } = nextProps;

    // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
    if (!isEqual(value, nextValue)) {
      this.setState({ errors: [], value: cloneValue(nextValue) });
    }

    // Let props override the `hasBeenValidated` state
    if (
      typeof hasBeenValidatedNext === "boolean" &&
      hasBeenValidatedNext !== hasBeenValidated
    ) {
      this.setState({ hasBeenValidated: hasBeenValidatedNext });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getFieldOnSubmitHandler(fieldHandler) {
    return () => {
      if (fieldHandler) fieldHandler();
      this.submit();
    };
  }

  getFieldOnChangeHandler(fieldName, fieldHandler) {
    return (value) => {
      if (fieldHandler) fieldHandler(value);

      const { validateOn, revalidateOn } = this.props;
      const { errors, hasBeenValidated } = this.state;

      this.doSet(this.state.value, fieldName, value);

      if (
        validateOn === "changed" ||
        validateOn === "changing" ||
        (hasBeenValidated &&
          (revalidateOn === "changed" || revalidateOn === "changing"))
      ) {
        this.validate().then((updatedErrors) => {
          if (!this._isMounted) return null;
          this.props.onChange(this.state.value, updatedErrors.length === 0);
        });
      } else {
        this.props.onChange(this.state.value, errors.length === 0);
      }
    };
  }

  getFieldOnChangingHandler(fieldName, fieldHandler) {
    return (value) => {
      if (fieldHandler) fieldHandler(value);

      const { validateOn, revalidateOn } = this.props;
      const { errors, hasBeenValidated } = this.state;

      this.doSet(this.state.value, fieldName, value);

      if (
        validateOn === "changing" ||
        (hasBeenValidated && revalidateOn === "changing")
      ) {
        this.validate().then((updatedErrors) => {
          if (!this._isMounted) return null;
          this.props.onChanging(this.state.value, updatedErrors.length === 0);
        });
      } else {
        this.props.onChanging(this.state.value, errors.length === 0);
      }
    };
  }

  getValue() {
    return this.state.value;
  }

  getErrors(fieldPaths, { includeDescendantErrors = false } = {}) {
    const { errors } = this.props;

    if (!Array.isArray(fieldPaths)) {
      throw new Error(
        "First argument to getErrors must be an array of field paths"
      );
    }

    return filterErrorsForNames(errors, fieldPaths, !includeDescendantErrors);
  }

  getFirstError(fieldPaths, options) {
    const fieldErrors = this.getErrors(fieldPaths, options);
    if (fieldErrors.length === 0) return null;
    return fieldErrors[0];
  }

  getFirstErrorMessage(fieldPaths, options) {
    const fieldError = this.getFirstError(fieldPaths, options);
    return (fieldError && fieldError.message) || null;
  }

  resetValue() {
    this.setState(
      {
        errors: [],
        hasBeenValidated: false,
        value: cloneValue(this.props.value),
      },
      () => {
        this.elementRefs.forEach((element) => {
          if (element && typeof element.resetValue === "function")
            element.resetValue();
        });
      }
    );
  }

  doSet(obj, path, value, callback) {
    // Since we clone the object whenever we set state from props, we can directly
    // set the prop rather than copying the whole object.
    if (value === undefined) {
      unset(obj, path);
    } else {
      set(obj, path, value);
    }
    this.setState({ value: obj }, callback);
  }

  // Form is dirty if value prop doesn't match value state. Whenever a changed
  // value prop comes in, we reset state to that, thus becoming clean.
  isDirty() {
    return !isEqual(this.state.value, this.props.value);
  }

  hasErrors(fieldPaths, options) {
    return this.getErrors(fieldPaths, options).length > 0;
  }

  /**
   * @return {Promise<Object[]>} A Promise that resolves with an array of errors. If the
   *   array is empty, there were no errors and submission was successful.
   */
  submit() {
    const { logErrorsOnSubmit, onSubmit, shouldSubmitWhenInvalid } = this.props;
    const { value } = this.state;
    return this.validate()
      .then((errors) => {
        if (logErrorsOnSubmit && errors.length > 0) console.error(errors);

        if (!this._isMounted) return errors;
        if (errors.length && !shouldSubmitWhenInvalid) return errors;

        return Promise.resolve()
          .then(() => {
            // onSubmit should ideally return a Promise so that we can wait
            // for submission to complete, but we won't worry about it if it doesn't
            return onSubmit(value, errors.length === 0);
          })
          .then(({ ok = true, errors: submissionErrors = [] } = {}) => {
            // Submission result must be an object with `ok` bool prop
            // and optional submission errors
            if (!Array.isArray(submissionErrors)) {
              throw new Error(
                "onSubmit returned an errors value that is not an array"
              );
            }

            if (this._isMounted) {
              if (ok) {
                this.resetValue();
              } else {
                this.setState({ errors: submissionErrors });
              }
            }

            return submissionErrors;
          })
          .catch((error) => {
            if (error) console.error('Form "onSubmit" function error:', error);
          });
      })
      .catch((error) => {
        if (error) console.error('Form "validate" function error:', error);
      });
  }

  validate() {
    const { validator } = this.props;
    const { value } = this.state;

    if (typeof validator !== "function") return Promise.resolve([]);

    return validator(value).then((errors) => {
      if (!Array.isArray(errors)) {
        console.error(
          "validator function must return a Promise that resolves with an array"
        );
        return [];
      }

      if (this._isMounted) {
        this.setState({ errors, hasBeenValidated: true });
      }

      return errors;
    });
  }

  renderFormFields() {
    let { value } = this.state;
    if (!value) value = {};

    const {
      children,
      inputOptions: { nullValue, propNames },
    } = this.props;

    let { errors: propErrors } = this.props;
    const { errors: stateErrors, hasBeenValidated } = this.state;
    if (!Array.isArray(propErrors)) propErrors = [];
    const errors = propErrors.concat(stateErrors);

    this.elementRefs = [];

    const propsFunc = (element) => {
      const newProps = {};

      if (element.type.isFormField) {
        const name = element.props[propNames.name];
        if (!name) return {};

        if (element.props.errors === undefined) {
          newProps.errors = filterErrorsForNames(errors, [name], false);
        }
      } else if (element.type.isFormErrors) {
        const { names } = element.props;
        if (!names) return {};
        if (element.props[propNames.errors] === undefined) {
          newProps[propNames.errors] = filterErrorsForNames(
            errors,
            names,
            true
          );
        }
      } else if (
        element.type.isFormInput ||
        element.type.isForm ||
        element.type.isFormList
      ) {
        const name = element.props[propNames.name];
        if (!name) return {};

        newProps[propNames.onChange] = this.getFieldOnChangeHandler(
          name,
          element.props[propNames.onChange]
        );
        newProps[propNames.onChanging] = this.getFieldOnChangingHandler(
          name,
          element.props[propNames.onChanging]
        );
        newProps[propNames.onSubmit] = this.getFieldOnSubmitHandler(
          element.props[propNames.onSubmit]
        );

        if (element.props[propNames.value] === undefined) {
          // Some input components (MUI) do not accept a `null` value.
          // For these, passing `{ nullValue: "" }` options does the trick.
          let inputValue = get(value, name);
          if (inputValue === null && nullValue !== undefined)
            inputValue = nullValue;
          newProps[propNames.value] = inputValue;
        }

        if (element.props[propNames.errors] === undefined) {
          newProps[propNames.errors] = filterErrorsForNames(
            errors,
            [name],
            false
          );

          // Adjust the error names to correct scope
          if (element.type.isForm) {
            const canonicalName = bracketsToDots(name);
            newProps[propNames.errors] = newProps[propNames.errors].map(
              (err) => {
                return {
                  ...err,
                  name: bracketsToDots(err.name).slice(
                    canonicalName.length + 1
                  ),
                };
              }
            );
          }
        }

        newProps[propNames.hasBeenValidated] = hasBeenValidated;

        if (element.type.isFormInput) {
          if (typeof element.props[propNames.isReadOnly] === "function") {
            newProps[propNames.isReadOnly] = element.props.isReadOnly(value);
          }
        }

        newProps.ref = (el) => {
          this.elementRefs.push(el);
        };
      }

      return newProps;
    };
    return recursivelyCloneElements(children, propsFunc, (element) => {
      // Leave children of nested forms alone because they're handled by that form
      // Leave children of lists alone because the FormList component deals with duplicating them
      return element.type.isForm || element.type.isFormList;
    });
  }

  render() {
    const { className, style } = this.props;

    return (
      <div className={className} style={style}>
        {this.renderFormFields()}
      </div>
    );
  }
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  errors: customPropTypes.errors,
  hasBeenValidated: PropTypes.bool,
  inputOptions: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    nullValue: PropTypes.any,
    propNames: PropTypes.shape({
      errors: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      hasBeenValidated: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      isReadOnly: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      onChange: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      onChanging: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      onSubmit: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    }),
  }),
  logErrorsOnSubmit: PropTypes.bool,
  // Top-level forms and those under FormList do not need a name
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  onChange: PropTypes.func,
  onChanging: PropTypes.func,
  onSubmit: PropTypes.func,
  revalidateOn: PropTypes.oneOf(["changing", "changed", "submit"]),
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  shouldSubmitWhenInvalid: PropTypes.bool,
  validateOn: PropTypes.oneOf(["changing", "changed", "submit"]),
  validator: PropTypes.func,
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

Form.defaultProps = {
  className: null,
  errors: undefined,
  hasBeenValidated: false,
  inputOptions: {
    nullValue: undefined,
    propNames: {
      errors: "errors",
      hasBeenValidated: "hasBeenValidated",
      isReadOnly: "isReadOnly",
      name: "name",
      onChange: "onChange",
      onChanging: "onChanging",
      onSubmit: "onSubmit",
      value: "value",
    },
  },
  logErrorsOnSubmit: false,
  name: null,
  onChange() {},
  onChanging() {},
  onSubmit() {},
  revalidateOn: "changing",
  style: {},
  shouldSubmitWhenInvalid: false,
  validateOn: "submit",
  validator: undefined,
  value: undefined,
};

export default Form;
