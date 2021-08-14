import { createMount } from '@material-ui/core/test-utils';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';

import MenuAppBar from './MenuAppBar';

describe('MenuAppBar', () => {
  let mount;

  beforeEach(() => {
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  test('Menu should link to Home, About, and How to Play', () => {
    const wrapper = mount(
      <MemoryRouter>
        <MenuAppBar />
      </MemoryRouter>
    );
    let homeLink = wrapper.findWhere(
      n => n.is(Link) && n.is({ madliberationid: 'menu-home-link' })
    );
    expect(homeLink.exists()).toBe(false);
    let aboutLink = wrapper.findWhere(
      n => n.is(Link) && n.is({ madliberationid: 'menu-about-link' })
    );
    expect(aboutLink.exists()).toBe(false);
    let howToPlayLink = wrapper.findWhere(
      n => n.is(Link) && n.is({ madliberationid: 'menu-how-to-play-link' })
    );
    expect(howToPlayLink.exists()).toBe(false);
    let menuButton = wrapper.findWhere(
      n =>
        n.is(IconButton) &&
        n.is({
          madliberationid: 'app-bar-menu-icon-button'
        })
    );
    const target = window.document.querySelector(
      `[madliberationid="app-bar-menu-icon-button"]`
    );
    const mockEventForClick = {
      currentTarget: target
    };
    menuButton.props().onClick(mockEventForClick);
    wrapper.update();
    homeLink = wrapper.findWhere(
      n => n.is(Link) && n.is({ madliberationid: 'menu-home-link' })
    );
    expect(homeLink.exists()).toBe(true);

    aboutLink = wrapper.findWhere(
      n => n.is(Link) && n.is({ madliberationid: 'menu-about-link' })
    );
    expect(aboutLink.exists()).toBe(true);
    howToPlayLink = wrapper.findWhere(
      n => n.is(Link) && n.is({ madliberationid: 'menu-how-to-play-link' })
    );
    expect(howToPlayLink.exists()).toBe(true);
    const menu = wrapper.find('#leftMenu').first();
    expect(menu.prop('anchorEl')).toBe(target);
  });
});
