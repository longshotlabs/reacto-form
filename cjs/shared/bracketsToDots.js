"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bracketsToDots;

var _toPath = _interopRequireDefault(require("lodash/toPath"));

function bracketsToDots(pathString) {
  return (0, _toPath.default)(pathString).join(".");
}