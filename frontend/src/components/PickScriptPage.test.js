import { createMount } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

import PickScriptPage from './PickScriptPage';
import ScriptTable from './ScriptTable';

describe('<PickScriptPage />', () => {
  let mount;
  beforeEach(() => {
    mount = createMount();
  });
  afterEach(() => {
    mount.cleanUp();
  });
  const fourScripts = {
    scripts: {
      Items: [
        {
          haggadah_description: 'An unoffensive script for the whole family',
          lib_id: 'script#0001',
          haggadah_short_desc: 'Family Script',
          room_code: 'AAAAAA',
          path: 'madliberation-scripts/001-Family_Script',
          is_script: 1,
          haggadah_name: '0001 - Family Script',
          script_number: 1
        },
        {
          haggadah_description:
            'An offensive script for only part of the family',
          lib_id: 'script#0002',
          haggadah_short_desc: 'Dirty Script',
          room_code: 'AAAAAB',
          path: 'madliberation-scripts/002-Dirty_Script',
          is_script: 1,
          haggadah_name: '0002 - Dirty Script',
          script_number: 2
        },
        {
          haggadah_description: 'An offensive script for the whole family',
          lib_id: 'script#0003',
          haggadah_short_desc: 'Dirty Family Script',
          room_code: 'AAAAAC',
          path: 'madliberation-scripts/003-Dirty_Family_Script',
          is_script: 1,
          haggadah_name: '0003 - Dirty Family Script',
          script_number: 3
        },
        {
          haggadah_description:
            'A script to help you get good at Mad Liberation',
          lib_id: 'script#0004',
          haggadah_short_desc: 'Practice Script',
          room_code: 'AAAAAD',
          path: 'madliberation-scripts/004-Practice_Script',
          is_script: 1,
          haggadah_name: '0004 - Practice Script',
          script_number: 4
        }
      ],
      Count: 4,
      ScannedCount: 4
    }
  };
  const getFourScripts = () => {
    return new Promise((resolve, reject) => {
      resolve(fourScripts);
    });
  };
  const scriptTableWithFourScripts = (
    <ScriptTable scripts={fourScripts.scripts.Items} />
  );
  const differentScripts = {
    scripts: {
      Items: [
        {
          haggadah_description:
            'An unoffensive script for the whole different family',
          lib_id: 'script#0001',
          haggadah_short_desc: 'Family Script',
          room_code: 'AAAAAA',
          path: 'madliberation-scripts/001-Family_Script',
          is_script: 1,
          haggadah_name: '0001 - Family Script',
          script_number: 1
        },
        {
          haggadah_description:
            'An offensive script for a different part of the family',
          lib_id: 'script#0002',
          haggadah_short_desc: 'Dirty Script',
          room_code: 'AAAAAB',
          path: 'madliberation-scripts/002-Dirty_Script',
          is_script: 1,
          haggadah_name: '0002 - Dirty Script',
          script_number: 2
        },
        {
          haggadah_description: 'An offensive script for the whole family',
          lib_id: 'script#0003',
          haggadah_short_desc: 'Dirty Family Script',
          room_code: 'AAAAAC',
          path: 'madliberation-scripts/003-Dirty_Family_Script',
          is_script: 1,
          haggadah_name: '0003 - Dirty Family Script',
          script_number: 3
        },
        {
          haggadah_description:
            'A script to help you get good at Mad Liberation',
          lib_id: 'script#0004',
          haggadah_short_desc: 'Practice Script',
          room_code: 'AAAAAD',
          path: 'madliberation-scripts/004-Practice_Script',
          is_script: 1,
          haggadah_name: '0004 - Practice Script',
          script_number: 4
        }
      ],
      Count: 4,
      ScannedCount: 4
    }
  };
  const scriptTableWithDifferentScripts = (
    <ScriptTable scripts={differentScripts.scripts.Items} />
  );
  test('JSON from getScripts should be displayed in a table', async () => {
    const wrapper = await mount(
      <MemoryRouter>
        <PickScriptPage getScripts={getFourScripts} setChosenPath={jest.fn()} />
      </MemoryRouter>
    );
    wrapper.update();
    expect(
      wrapper.containsMatchingElement(scriptTableWithFourScripts)
    ).toBeTruthy();
    expect(
      wrapper.containsMatchingElement(scriptTableWithDifferentScripts)
    ).toBeFalsy();
  });
});
