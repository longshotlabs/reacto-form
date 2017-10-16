import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

import customPropTypes from '../shared/propTypes';

class Field extends Component {
  static isComposableFormField = true;

  static propTypes = {
    // Any number of inputs or other elements, but at least 1 input
    children: PropTypes.node.isRequired,
    // Additional classes to add to the field wrapper div
    className: PropTypes.string,
    errors: customPropTypes.errors,
    // Label is usually a string but could be elements
    label: PropTypes.node,
    // Additional classes to add to the label element
    labelClassName: PropTypes.string,
    // "for" attribute for <label>
    labelFor: PropTypes.string,
    // Set to true if this field is required. Results in data-required
    // boolean attribute being added, which can be used for styling or
    // displaying an asterisk.
    isRequired: PropTypes.bool,
    // Styles object for the field wrapper div
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    className: null,
    errors: undefined,
    label: null,
    labelClassName: null,
    labelFor: null,
    isRequired: false,
    style: {},
  };

  getClassName() {
    const { className, errors } = this.props;
    return `reacto-form-field ${className || ''} ${Array.isArray(errors) && errors.length > 0 ? 'has-error' : ''}`.trim();
  }

  renderLabel() {
    const { label, labelClassName, labelFor } = this.props;
    const className = `reacto-form-label ${labelClassName || ''}`.trim();

    return (
      <label className={className} htmlFor={labelFor}>{label}</label>
    );
  }

  render() {
    const { children, isRequired, label, style } = this.props;

    return (
      <div className={this.getClassName()} data-required={isRequired} style={style}>
        {!isEmpty(label) && this.renderLabel()}
        {children}
      </div>
    );
  }
}

export default Field;
