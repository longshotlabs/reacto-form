"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = recursivelyCloneElements;

var _react = _interopRequireDefault(require("react"));

/**
 * Recursively clone elements
 *
 * @param {React node} elements - React elements to traverse through. This can be an array or a single
 *                                element or null, so it's ok to pass the `children` prop directly.
 * @param {Function} [getProps] - A function that takes an element and returns props to be applied to the clone of that element
 * @param {Function} [shouldStopRecursing] - A function that takes an element and returns a truthy value if `recursivelyCloneElements`
 *                                         should not be called for that element's children
 */
function recursivelyCloneElements(elements, getProps, shouldStopRecursing) {
  var newElements = _react.default.Children.map(elements, function (element) {
    if (!element || typeof element === "string" || !element.props) return element;
    if (typeof getProps !== "function") getProps = function getProps() {
      return {};
    };
    if (typeof shouldStopRecursing !== "function") shouldStopRecursing = function shouldStopRecursing() {
      return false;
    };
    var children = shouldStopRecursing(element) ? element.props.children : recursivelyCloneElements(element.props.children, getProps);
    return /*#__PURE__*/_react.default.cloneElement(element, getProps(element), children);
  });

  return Array.isArray(newElements) && newElements.length === 1 ? newElements[0] : newElements;
}