import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

import customPropTypes from '../shared/propTypes';

class ErrorsBlock extends Component {
  static isComposableFormErrors = true;

  static propTypes = {
    // Additional classes to add to the block div
    className: PropTypes.string,
    errors: customPropTypes.errors,
    // Styles object for the individual error messages in the block
    errorStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    names: PropTypes.arrayOf(PropTypes.string),
    // Styles object for the block div
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    className: null,
    errors: undefined,
    errorStyle: {},
    names: undefined,
    style: {},
  };

  render() {
    const { errorStyle, errors, className: classNameProp, style } = this.props;
    const className = `reacto-form-errors ${classNameProp || ''}`.trim();

    if (isEmpty(errors)) return null;

    // https://reactjs.org/docs/lists-and-keys.html
    // "When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort.
    // We don’t recommend using indexes for keys if the items can reorder, as that would be slow."
    //
    // There will rarely be more than a few errors for a field, and forcing unique ID
    // generation for them would be arbitrary and unnecessary. So we'll use the index.
    return (
      <div className={className} style={style}>
        {errors.map((error, index) => {
          return (<div key={index} data-name={error.name} style={errorStyle}>{error.message}</div>); // eslint-disable-line react/no-array-index-key
        })}
      </div>
    );
  }
}

export default ErrorsBlock;
