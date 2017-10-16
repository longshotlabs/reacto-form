import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import clone from 'clone';

import bracketsToDots from '../shared/bracketsToDots';
import customPropTypes from '../shared/propTypes';
import filterErrorsForNames from '../shared/filterErrorsForNames';
import recursivelyCloneElements from '../shared/recursivelyCloneElements';

const styles = {
  button: {
    paddingTop: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 0,
    width: '3.5rem',
    height: '3.5rem',
    verticalAlign: '-webkit-baseline-middle',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderBottomStyle: 'solid',
    borderTopStyle: 'none',
    borderLeftStyle: 'none',
    borderRightStyle: 'none',
    paddingBottom: '1rem',
    marginBottom: '1rem',
  },
  itemLeft: {
    paddingRight: '1.5rem',
  },
  itemRight: {
    flexGrow: 1,
  },
  lastItem: {
    display: 'flex',
    flexDirection: 'row',
  },
  list: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderStyle: 'solid',
    borderRadius: 3,
    padding: '1rem',
  },
  addItemRow: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderBottomStyle: 'none',
    borderTopStyle: 'solid',
    borderLeftStyle: 'none',
    borderRightStyle: 'none',
    paddingTop: '1rem',
    marginTop: '1rem',
  },
};

class FormList extends Component {
  static isComposableFormList = true;

  static propTypes = {
    buttonClassName: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    errors: customPropTypes.errors,
    itemAreaClassName: PropTypes.string,
    itemClassName: PropTypes.string,
    itemRemoveAreaClassName: PropTypes.string,
    maxCount: PropTypes.number,
    minCount: PropTypes.number,
    name: PropTypes.string.isRequired,
    onChanging: PropTypes.func,
    onChanged: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.any),
  };

  static defaultProps = {
    buttonClassName: null,
    className: null,
    errors: undefined,
    itemAreaClassName: null,
    itemClassName: null,
    itemRemoveAreaClassName: null,
    minCount: 0,
    maxCount: undefined,
    onChanging() {},
    onChanged() {},
    onSubmit() {},
    value: [],
  };

  constructor(props) {
    super(props);

    let { minCount, value } = props;
    value = clone(value || []);
    minCount = minCount || 0;
    while (value.length < minCount) {
      value.push(null);
    }

    this.state = { value };

    this.elementRefs = [];
  }

  componentWillMount() {
    const { value } = this.state;
    this.handleChanging(value);
    this.handleChanged(value);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    let { minCount, value: nextValue } = nextProps;
    const { value: stateValue } = this.state;

    // Whenever a changed value prop comes in, we reset state to that, thus becoming clean.
    if (!isEqual(value, nextValue)) {
      nextValue = clone(nextValue || []);
      minCount = minCount || 0;
      while (nextValue.length < minCount) {
        nextValue.push(null);
      }

      // We also keep the array length the same so that items don't disappear and
      // confuse the user.
      while (nextValue.length < stateValue.length) {
        nextValue.push(null);
      }

      this.setState({ value: nextValue });
      this.handleChanging(nextValue);
      this.handleChanged(nextValue);
    }
  }

  getFieldValueHandler(index, isChanged) {
    return (itemValue) => {
      const { value } = this.state;
      value[index] = itemValue;
      this.setState({ value });
      if (isChanged) {
        this.handleChanged(value);
      } else {
        this.handleChanging(value);
      }
    };
  }

  getValue() {
    return this.state.value;
  }

  resetValue() {
    let { minCount, value } = this.props;
    value = clone(value || []);
    minCount = minCount || 0;
    while (value.length < minCount) {
      value.push(null);
    }
    this.setState({ value });

    this.elementRefs.forEach((element) => {
      if (element) element.resetValue();
    });
  }

  handleChanged(value) {
    const { onChanged } = this.props;
    if (!isEqual(value, this.lastChangedValue)) {
      this.lastChangedValue = value;
      onChanged(value);
    }
  }

  handleChanging(value) {
    const { onChanging } = this.props;
    if (!isEqual(value, this.lastChangingValue)) {
      this.lastChangingValue = value;
      onChanging(value);
    }
  }

  handleClickAddItem = () => {
    const { value } = this.state;
    value.push(null);
    this.setState({ value });
  };

  handleClickRemoveItem(index) {
    return () => {
      const { minCount } = this.props;
      const { value } = this.state;

      if (value.length === Math.max(minCount || 0, 0)) return;

      value.splice(index, 1); // mutation is ok because we cloned, and likely faster
      this.setState({ value });
      this.handleChanging(value);
      this.handleChanged(value);
    };
  }

  renderArrayItems() {
    const { buttonClassName, children, errors, itemAreaClassName, itemClassName, itemRemoveAreaClassName, minCount, name, onSubmit } = this.props;
    const { value } = this.state;

    // We'll do these checks just once, outside of the `value.map`, for speed.
    // This extra loop might be slower for small arrays, but will help with large arrays.
    let itemChild;
    let errorsChild;
    React.Children.forEach(children, (child) => {
      if (child.type.isComposableFormList) {
        throw new Error('reacto-form FormList: FormList may not be a child of FormList');
      }
      if (child.type.isComposableForm || child.type.isComposableFormInput) {
        if (itemChild) throw new Error('reacto-form FormList: FormList must have exactly one Input or Form child');
        itemChild = child;
      }
      if (child.type.isComposableFormErrors) {
        if (errorsChild) throw new Error('reacto-form FormList: FormList may have no more than one ErrorsBlock child');
        errorsChild = child;
      }
    });

    const hasMoreThanMinCount = value.length > Math.max(minCount || 0, 0);

    this.elementRefs = [];

    return value.map((itemValue, index) => {
      const itemName = `${name}[${index}]`;
      const kids = React.Children.map(children, (child) => {
        if (child.type.isComposableForm || child.type.isComposableFormInput) {
          let filteredErrors = filterErrorsForNames(errors, [itemName], false);
          // Adjust the error names to correct scope
          if (child.type.isComposableForm) {
            filteredErrors = filteredErrors.map((err) => {
              return {
                ...err,
                name: bracketsToDots(err.name).slice(`${name}.${index}`.length + 1),
              };
            });
          }

          return React.cloneElement(child, {
            errors: filteredErrors,
            name: itemName,
            onChanged: this.getFieldValueHandler(index, true),
            onChanging: this.getFieldValueHandler(index, false),
            onSubmit,
            ref: (el) => { this.elementRefs.push(el); },
            value: itemValue,
          }, recursivelyCloneElements(child.props.children));
        } else if (child.type.isComposableFormErrors) {
          return React.cloneElement(child, {
            errors: filterErrorsForNames(errors, [itemName], true),
            names: [itemName],
          }, recursivelyCloneElements(child.props.children));
        }
        return recursivelyCloneElements(child);
      });

      return (
        <div className={itemClassName} key={itemName} style={index + 1 === value.length ? styles.lastItem : styles.item}>
          {hasMoreThanMinCount && <div className={itemRemoveAreaClassName} style={styles.itemLeft}>
            <button type="button" className={buttonClassName} onClick={this.handleClickRemoveItem(index)} style={styles.button}>–</button>
          </div>}
          <div className={itemAreaClassName} style={styles.itemRight}>
            {kids}
          </div>
        </div>
      );
    });
  }

  renderAddItemButton() {
    const { buttonClassName, itemClassName } = this.props;
    const { value } = this.state;
    return (
      <div className={itemClassName} style={value.length === 0 ? {} : styles.addItemRow}>
        <button type="button" className={buttonClassName} onClick={this.handleClickAddItem} style={styles.button}>+</button>
      </div>
    );
  }

  render() {
    const { className, maxCount } = this.props;
    let { value } = this.state;
    if (!value) value = [];
    const hasFewerThanMaxCount = value.length < maxCount || maxCount === undefined || maxCount === null;

    return (
      <div className={className} style={styles.list}>
        {this.renderArrayItems()}
        {hasFewerThanMaxCount && this.renderAddItemButton()}
      </div>
    );
  }
}

export default FormList;
