import React from "react";

/**
 * Recursively clone elements
 *
 * @param {React node} elements - React elements to traverse through. This can be an array or a single
 *                                element or null, so it's ok to pass the `children` prop directly.
 * @param {Function} [getProps] - A function that takes an element and returns props to be applied to the clone of that element
 * @param {Function} [shouldStopRecursing] - A function that takes an element and returns a truthy value if `recursivelyCloneElements`
 *                                         should not be called for that element's children
 */
export default function recursivelyCloneElements(
  elements,
  getProps,
  shouldStopRecursing
) {
  const newElements = React.Children.map(elements, (element) => {
    if (!element || typeof element === "string" || !element.props)
      return element;

    if (typeof getProps !== "function") getProps = () => ({});
    if (typeof shouldStopRecursing !== "function")
      shouldStopRecursing = () => false;

    const children = shouldStopRecursing(element)
      ? element.props.children
      : recursivelyCloneElements(element.props.children, getProps);

    return React.cloneElement(element, getProps(element), children);
  });

  return Array.isArray(newElements) && newElements.length === 1
    ? newElements[0]
    : newElements;
}
