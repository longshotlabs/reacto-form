"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filterErrorsForNames;

var _bracketsToDots = _interopRequireDefault(require("./bracketsToDots"));

function filterErrorsForNames(errors, names, exact) {
  if (!Array.isArray(errors) || !Array.isArray(names)) return []; // Accept paths that may contain brackets or dots, making them all dots

  names = names.map(function (name) {
    return (0, _bracketsToDots.default)(name);
  });
  return errors.filter(function (error) {
    var errorName = (0, _bracketsToDots.default)(error.name);
    return names.some(function (name) {
      if (name === errorName) return true;
      return !exact && errorName.startsWith("".concat(name, "."));
    });
  });
}