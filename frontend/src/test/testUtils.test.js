import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import * as tu from './testUtils';

let mount;
beforeEach(() => {
  mount = createMount();
});
afterEach(() => {
  mount.cleanUp();
});

describe('testUtils', () => {
  test('...', () => {
    expect(1).toEqual(1);
  });
  describe('expectFewerThanNOfSelector', () => {
    test('wrapper with 0 matches', () => {
      const w = mount(
        <div>
          <div foo="bar"></div>
          <div foo="bar"></div>
          <div foo="bar"></div>
          <div foo="bar"></div>
        </div>
      );
      tu.expectFewerThanNOfSelector(w, { foo: 'baz' }, 1);
    });
  });
  describe('fewerThanNOfSelector', () => {
    test('wrapper with 0 matches', () => {
      const w = mount(
        <div>
          <div foo="bar"></div>
          <div foo="bar"></div>
          <div foo="bar"></div>
          <div foo="bar"></div>
        </div>
      );
      expect(tu.fewerThanNOfSelector(w, { foo: 'baz' }, 1)).toBe(true);
      expect(tu.fewerThanNOfSelector(w, { foo: 'baz' }, 2)).toBe(true);
      expect(tu.fewerThanNOfSelector(w, { foo: 'baz' }, 3)).toBe(true);
      expect(tu.fewerThanNOfSelector(w, { foo: 'baz' }, 0)).toBe(false);
    });
    test('wrapper with 1 match', () => {
      const w = mount(
        <div>
          <div foo="bar"></div>
          <div foo="baz"></div>
          <div foo="bar"></div>
          <div foo="bar"></div>
        </div>
      );
      tu.fewerThanNOfSelector(w, { foo: 'baz' }, 1);
      expect(tu.fewerThanNOfSelector(w, { foo: 'baz' }, 1)).toBe(false);
      expect(tu.fewerThanNOfSelector(w, { foo: 'baz' }, 2)).toBe(true);
      expect(tu.fewerThanNOfSelector(w, { foo: 'baz' }, 3)).toBe(true);
      expect(tu.fewerThanNOfSelector(w, { foo: 'baz' }, 0)).toBe(false);
    });
    test('wrapper with 2 matches', () => {});
    test('wrapper with 3 matches', () => {});
    test('wrapper with 4 matches', () => {});
  });
});
