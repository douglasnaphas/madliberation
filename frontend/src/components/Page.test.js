import { Button } from '@material-ui/core';
import { createMount } from '@material-ui/core/test-utils';
import Page from './Page';
import React from 'react';

describe('<Page />', () => {
  let mount;

  beforeEach(() => {
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  const p1 = {
    lines: [
      {
        type: 'h1',
        segments: [{ type: 'text', text: 'A Very Practice Passover' }]
      },
      {
        type: 'h4',
        segments: [
          {
            type: 'text',
            text: 'A safe space to learn how to play Mad Liberation'
          }
        ]
      },
      {
        type: 'p',
        segments: [
          { type: 'text', text: 'Come, Jew, on a Jewney of liberation.' }
        ]
      },
      {
        type: 'h2',
        segments: [{ type: 'text', text: 'The bad old days' }]
      },
      {
        type: 'p',
        segments: [
          {
            type: 'text',
            text:
              'Have you ever been to a seder where someone says, “Stop looking at your phone”?'
          }
        ]
      },
      {
        type: 'p',
        segments: [
          {
            type: 'text',
            text:
              'The only thing that ruins Passover quicker than that is when someone '
          },
          {
            type: 'lib',
            id: 1,
            prompt: 'does something disruptive',
            answer: 'one'
          },
          { type: 'text', text: '.' }
        ]
      },
      {
        type: 'p',
        segments: [
          {
            type: 'text',
            text: 'Here is another lib, coming at you like '
          },
          {
            type: 'lib',
            id: 2,
            prompt: 'something fast and heavy',
            answer: 'two'
          },
          { type: 'text', text: '.' }
        ]
      }
    ]
  };
  const readyToReadButton = (
    <Button
      madliberationid="ready-to-read-button"
      variant="contained"
      color="primary"
    >
      Ready to read
    </Button>
  );
  const nextPageButton = (
    <Button
      madliberationid="next-page-button"
      variant="contained"
      color="primary"
    >
      Next page
    </Button>
  );

  test('full DOM rendering', async () => {
    const wrapper = await mount(<Page page={p1} pageIndex={0} />);
    wrapper.update();
    expect(wrapper.containsMatchingElement(readyToReadButton)).toBeTruthy();
    expect(wrapper.containsMatchingElement(nextPageButton)).toBeFalsy();
    wrapper
      .find('[madliberationid="ready-to-read-button"]')
      .first()
      .simulate('click');
    expect(wrapper.containsMatchingElement(readyToReadButton)).toBeFalsy();
    expect(wrapper.containsMatchingElement(nextPageButton)).toBeTruthy();
    wrapper.unmount();
  });
});
