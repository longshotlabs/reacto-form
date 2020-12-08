import PropTypes from "prop-types";

const customPropTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default customPropTypes;
