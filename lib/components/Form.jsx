import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import get from 'lodash.get';
import set from 'lodash.set';
import unset from 'lodash.unset';
import clone from 'clone';

import bracketsToDots from '../shared/bracketsToDots';
import customPropTypes from '../shared/propTypes';
import filterErrorsForNames from '../shared/filterErrorsForNames';
import recursivelyCloneElements from '../shared/recursivelyCloneElements';

// To ensure we do not mutate objects passed in, we'll do a deep clone.
function cloneValue(value) {
  return value ? clone(value) : {};
}

class Form extends Component {
  static isComposableForm = true;

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    errors: customPropTypes.errors,
    logErrorsOnSubmit: PropTypes.bool,
    // Top-level forms and those under FormList do not need a name
    name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    onChanged: PropTypes.func,
    onChanging: PropTypes.func,
    onSubmit: PropTypes.func,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    validateOn: PropTypes.oneOf(['changing', 'changed', 'submit']),
    validateOnWhenInvalid: PropTypes.oneOf(['changing', 'changed', 'submit']),
    validator: PropTypes.func,
    value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    className: null,
    errors: undefined,
    logErrorsOnSubmit: false,
    name: null,
    onChanged() {},
    onChanging() {},
    onSubmit() {},
    style: {},
    validateOn: 'submit',
    validateOnWhenInvalid: 'changing',
    validator: () => Promise.resolve([]),
    value: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      value: cloneValue(props.value),
    };

    this.elementRefs = [];
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    const { value: nextValue } = nextProps;

    // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
    if (!isEqual(value, nextValue)) {
      this.setState({ errors: [], value: cloneValue(nextValue) });
    }
  }

  getFieldOnSubmitHandler(fieldHandler) {
    return () => {
      if (fieldHandler) fieldHandler();
      this.submit();
    };
  }

  getFieldOnChangedHandler(fieldName, fieldHandler) {
    return (value) => {
      if (fieldHandler) fieldHandler(value);

      const { validateOn, validateOnWhenInvalid } = this.props;
      const { errors } = this.state;

      this.doSet(this.state.value, fieldName, value);

      const fieldIsCurrentlyInvalid = filterErrorsForNames(errors, [fieldName], false).length > 0;
      if (
        validateOn === 'changed' ||
        validateOn === 'changing' ||
        (
          fieldIsCurrentlyInvalid &&
          (validateOnWhenInvalid === 'changed' || validateOnWhenInvalid === 'changing')
        )
      ) {
        this.validate().then((updatedErrors) => {
          this.props.onChanged(this.state.value, updatedErrors.length === 0);
        });
      } else {
        this.props.onChanged(this.state.value, errors.length === 0);
      }
    };
  }

  getFieldOnChangingHandler(fieldName, fieldHandler) {
    return (value) => {
      if (fieldHandler) fieldHandler(value);

      const { validateOn, validateOnWhenInvalid } = this.props;
      const { errors } = this.state;

      this.doSet(this.state.value, fieldName, value);

      const fieldIsCurrentlyInvalid = filterErrorsForNames(errors, [fieldName], false).length > 0;
      if (
        validateOn === 'changing' ||
        (fieldIsCurrentlyInvalid && validateOnWhenInvalid === 'changing')
      ) {
        this.validate().then((updatedErrors) => {
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

  // Form is dirty if value prop doesn't match value state. Whenever a changed
  // value prop comes in, we reset state to that, thus becoming clean.
  isDirty() {
    return !isEqual(this.state.value, this.props.value);
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

  resetValue() {
    this.setState({ errors: [], value: cloneValue(this.props.value) }, () => {
      this.elementRefs.forEach((element) => {
        if (element) element.resetValue();
      });
    });
  }

  submit() {
    const { logErrorsOnSubmit, onSubmit } = this.props;
    const { value } = this.state;
    this.validate()
      .then((errors) => {
        if (!Array.isArray(errors)) throw new Error('Resolved with non-array');
        if (logErrorsOnSubmit && errors.length > 0) console.error(errors);
        return onSubmit(value, errors.length === 0)
          .then(() => {
            this.resetValue();
          })
          .catch((error) => {
            console.warn('Form "onSubmit" function error:', error);
          });
      })
      .catch((error) => {
        console.warn('Form "validate" function error:', error);
      });
  }

  validate() {
    const { validator } = this.props;
    const { value } = this.state;

    if (typeof validator !== 'function') return Promise.resolve([]);

    return validator(value).then((errors) => {
      if (!Array.isArray(errors)) {
        console.error('validator function must return a Promise that resolves with an array');
        return;
      }
      this.setState({ errors });
      return errors;
    });
  }

  renderFormFields() {
    let { value } = this.state;
    if (!value) value = {};

    const { children } = this.props;
    let { errors: propErrors } = this.props;
    const { errors: stateErrors } = this.state;
    if (!Array.isArray(propErrors)) propErrors = [];
    const errors = propErrors.concat(stateErrors);

    this.elementRefs = [];

    const propsFunc = (element) => {
      const newProps = {};

      if (element.type.isComposableFormField) {
        const { name } = element.props;
        if (!name) return {};
        if (element.props.errors === undefined) {
          newProps.errors = filterErrorsForNames(errors, [name], false);
        }
      } else if (element.type.isComposableFormErrors) {
        const { names } = element.props;
        if (!names) return {};
        if (element.props.errors === undefined) {
          newProps.errors = filterErrorsForNames(errors, names, true);
        }
      } else if (element.type.isComposableFormInput || element.type.isComposableForm || element.type.isComposableFormList) {
        const { name } = element.props;
        if (!name) return {};
        newProps.onChanged = this.getFieldOnChangedHandler(name, element.props.onChanged);
        newProps.onChanging = this.getFieldOnChangingHandler(name, element.props.onChanging);
        newProps.onSubmit = this.getFieldOnSubmitHandler(element.props.onSubmit);

        if (element.props.value === undefined) {
          newProps.value = get(value, name);
        }

        if (element.props.errors === undefined) {
          newProps.errors = filterErrorsForNames(errors, [name], false);

          // Adjust the error names to correct scope
          if (element.type.isComposableForm) {
            const canonicalName = bracketsToDots(name);
            newProps.errors = newProps.errors.map((err) => {
              return {
                ...err,
                name: bracketsToDots(err.name).slice(canonicalName.length + 1),
              };
            });
          }
        }

        if (element.type.isComposableFormInput) {
          if (typeof element.props.isReadOnly === 'function') {
            newProps.isReadOnly = element.props.isReadOnly(value);
          }
        }

        newProps.ref = (el) => { this.elementRefs.push(el); };
      }

      return newProps;
    };
    return recursivelyCloneElements(children, propsFunc, (element) => {
      // Leave children of nested forms alone because they're handled by that form
      // Leave children of lists alone because the FormList component deals with duplicating them
      return element.type.isComposableForm || element.type.isComposableFormList;
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

export default Form;
