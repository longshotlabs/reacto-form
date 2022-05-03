"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var customPropTypes = {
  errors: _propTypes.default.arrayOf(_propTypes.default.shape({
    message: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired
  }))
};
var _default = customPropTypes;
exports.default = _default;