/**
 * expect that fewer than n nodes match selector
 * @param {ReactWrapper} wrapper A ReactWrapper to search
 * @param {Selector} selector An Enzyme Selector to search for
 * @param {Number} n
 */
export const expectFewerThanNOfSelector = (wrapper, selector, n) => {
  expect(() => {
    const p = wrapper
      .findWhere(node => node.is(selector))
      .at(n - 1)
      .props();
  }).toThrow();
};

/**
 * @returns {boolean} true if there are fewer than n of selector, false
 * otherwise
 * @param {ReactWrapper} wrapper A ReactWrapper to search
 * @param {Selector} selector An Enzyme Selector to search for
 * @param {Number} n
 */
export const fewerThanNOfSelector = (wrapper, selector, n) => {
  if (n < 1) return false;
  try {
    wrapper
      .find(selector)
      .at(n - 1)
      .props();
  } catch (e) {
    return true;
  }
  return false;
};

/**
 * expect that at least n nodes match selector
 * @param {ReactWrapper} wrapper A ReactWrapper to search
 * @param {Selector} selector An Enzyme Selector to search for
 * @param {Number} n
 */
export const expectAtLeastNOfSelector = (wrapper, selector, n) => {
  expect(() => {
    wrapper
      .findWhere(node => node.is(selector))
      .at(n - 1)
      .props();
  }).not.toThrow();
};

export const expectSelectorCount = (wrapper, selector, n) => {
  expectFewerThanNOfSelector(wrapper, selector, n + 1);
  expectAtLeastNOfSelector(wrapper, selector, n);
};
