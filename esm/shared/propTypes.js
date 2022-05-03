import PropTypes from "prop-types";
var customPropTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }))
};
export default customPropTypes;