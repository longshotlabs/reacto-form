import PropTypes from 'prop-types';

const optionsSyntax = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
}));

const customPropTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  inputs: {
    isDisabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    isReadOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    name: PropTypes.string,
    onChanged: PropTypes.func,
    onChanging: PropTypes.func,
  },
  options: PropTypes.oneOfType([
    optionsSyntax,
    PropTypes.arrayOf(PropTypes.shape({
      optgroup: PropTypes.string,
      options: optionsSyntax,
    })),
  ]),
};

export default customPropTypes;
