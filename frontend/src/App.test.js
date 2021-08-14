import { createMount } from '@material-ui/core/test-utils';
import React from 'react';

import App from './App';
import HomePage from './components/HomePage';

describe('<App />', () => {
  let mount;

  beforeEach(() => {
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  test('/ should show the HomePage', async () => {
    const wrapper = await mount(<App />);
    wrapper.update();
    expect(wrapper.containsMatchingElement(<HomePage />)).toBeTruthy();
  });
});
