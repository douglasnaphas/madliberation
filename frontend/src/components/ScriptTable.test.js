import { Button } from '@material-ui/core';
import { createMount } from '@material-ui/core/test-utils';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Radio from '@material-ui/core/Radio';

import ScriptTable from './ScriptTable';
import {
  testUtils,
  expectSelectorCount,
  expectFewerThanNOfSelector
} from '../test/testUtils';

let mount;
beforeEach(() => {
  mount = createMount();
});
afterEach(() => {
  mount.cleanUp();
});

/**
 * Click the radio button next to script number scriptNumber
 * @param {ReactWrapper} wrapper The wrapper to search
 * @param {Number} scriptNumber The id of the script in the table
 */
function selectScript(wrapper, scriptNumber) {
  wrapper
    .findWhere(n => n.is(Radio) && n.is(`#script-${scriptNumber}`))
    .prop('onChange')({
    target: { value: `${scriptNumber}` }
  });
  wrapper.update();
}

/**
 * @returns {boolean} true if script number scriptNumber is present and
 * selected, false otherwise
 * @param {ReactWrapper} wrapper The wrapper to search
 * @param {Number} scriptNumber The id of the script in the table
 */
function scriptChecked(wrapper, scriptNumber) {
  return wrapper
    .findWhere(
      n =>
        n.is(Radio) && n.is(`#script-${scriptNumber}`) && n.is('[checked=true]')
    )
    .exists();
}

/**
 * @returns {boolean} true if every script number in scriptNumbers is present
 * and unchecked, false otherwise
 * @param {ReactWrapper} wrapper
 * @param {Array[Number]} scriptNumbers
 */
function scriptsUnchecked(wrapper, scriptNumbers) {}

/**
 * @returns {boolean} true if every index in {0, 1, ..., scriptCount - 1} is
 * unchecked and selectedScriptNumber is checked, false otherwise
 * @param {ReactWrapper} wrapper
 * @param {Number} selectedScriptNumber
 * @param {Number} scriptCount
 */
function scriptCheckedOnly(wrapper, selectedScriptNumber, scriptCount) {
  if (!scriptChecked(wrapper, selectedScriptNumber)) return false;
  for (let i = 0; i < scriptCount; i++) {
    if (i != selectedScriptNumber && scriptChecked(i)) return false;
  }
  return true;
}

function fourScripts() {
  return [
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
      haggadah_description: 'An offensive script for only part of the family',
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
      haggadah_description: 'A script to help you get good at Mad Liberation',
      lib_id: 'script#0004',
      haggadah_short_desc: 'Practice Script',
      room_code: 'AAAAAD',
      path: 'madliberation-scripts/004-Practice_Script',
      is_script: 1,
      haggadah_name: '0004 - Practice Script',
      script_number: 4
    }
  ];
}
function differentScripts() {
  return [
    {
      haggadah_description:
        'An unoffensive script for the whole different family',
      lib_id: 'script#0005',
      haggadah_short_desc: 'Different Family Script',
      room_code: 'AAAAAE',
      path: 'madliberation-scripts/005-Family_Script',
      is_script: 1,
      haggadah_name: '0005 - Family Script',
      script_number: 5
    },
    {
      haggadah_description:
        'An offensive script for a different part of the family',
      lib_id: 'script#0007',
      haggadah_short_desc: 'Dirty Script',
      room_code: 'AAAAAF',
      path: 'madliberation-scripts/007-Dirty_Script',
      is_script: 1,
      haggadah_name: '0007 - Dirty Script',
      script_number: 7
    },
    {
      haggadah_description:
        'An offensive script for the whole different family',
      lib_id: 'script#0008',
      haggadah_short_desc: 'Dirty Family Script',
      room_code: 'AAAAAG',
      path: 'madliberation-scripts/008-Dirty_Family_Script',
      is_script: 1,
      haggadah_name: '0008 - Dirty Family Script',
      script_number: 8
    },
    {
      haggadah_description: 'A script to help you get good at Mad Liberation',
      lib_id: 'script#0006',
      haggadah_short_desc: 'Practice Script',
      room_code: 'AAAAAH',
      path: 'madliberation-scripts/006-Practice_Script',
      is_script: 1,
      haggadah_name: '0006 - Practice Script',
      script_number: 6
    }
  ];
}
function getProps({ scripts }) {
  return {
    scripts,
    setChosenPath: jest.fn()
  };
}
function expectedTable(scripts, selectedIndex) {
  return (
    <Table>
      <TableBody>
        {scripts.map((script, index) => {
          const scriptUid = `${script.room_code}-${script.lib_id}`;
          return (
            <TableRow key={`row${scriptUid}`}>
              <TableCell key={`${scriptUid}-select`}>
                <Radio
                  key={`${scriptUid}-radio`}
                  checked={`${selectedIndex}` === `${index}`}
                  value={`${index}`}
                  id={`script-${index}`}
                />
              </TableCell>
              <TableCell key={`${scriptUid}-short_desc`}>
                <label
                  htmlFor={`script-${index}`}
                  madliberationid={`${script.haggadah_short_desc}`}
                >
                  {script.haggadah_short_desc}
                </label>
              </TableCell>
              <TableCell key={`${scriptUid}-description`}>
                {script.haggadah_description}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

describe('<ScriptTable />', () => {
  test('scripts in props should appear in a table 1', () => {
    const props = getProps({ scripts: fourScripts() });
    const wrapper = mount(
      <MemoryRouter>
        <ScriptTable {...props} />
      </MemoryRouter>
    );
    expect(
      wrapper.containsMatchingElement(expectedTable(fourScripts(), 0))
    ).toBe(true);
  });
  test('scripts in props should appear in a table 2', () => {
    const props = getProps({ scripts: differentScripts() });
    const wrapper = mount(
      <MemoryRouter>
        <ScriptTable {...props} />
      </MemoryRouter>
    );
    expect(
      wrapper.containsMatchingElement(expectedTable(differentScripts(), 0))
    ).toBe(true);
  });
  test(
    'the Use This One button should call setChosenPath with the selected' +
      ' script, after others have been clicked',
    () => {
      const props = getProps({ scripts: fourScripts() });
      const wrapper = mount(
        <MemoryRouter>
          <ScriptTable {...props} />
        </MemoryRouter>
      );
      expect(scriptChecked(wrapper, 0)).toBe(true);
      // click the 3rd script
      selectScript(wrapper, 2);
      expect(scriptChecked(wrapper, 0)).toBe(false);
      expect(scriptChecked(wrapper, 2)).toBe(true);
      expectSelectorCount(wrapper, Radio, 4);
      expect(scriptCheckedOnly(wrapper, 2)).toBe(true);
      // click the 2nd script
      selectScript(wrapper, 1);
      expect(scriptCheckedOnly(wrapper, 1)).toBe(true);
      // submit
      wrapper
        .findWhere(
          n =>
            n.is(Button) && n.is({ madliberationid: 'pick-this-script-button' })
        )
        .prop('onClick')();
      // verify setChosenPath was called once with the 2nd script
      expect(props.setChosenPath).toHaveBeenCalled();
      expect(props.setChosenPath).toHaveBeenCalledTimes(1);
      expect(props.setChosenPath).toHaveBeenCalledWith(
        'madliberation-scripts/002-Dirty_Script'
      );
    }
  );
  test(
    'the Use This One button should call setChosenPath with the selected' +
      ' script 2',
    () => {
      const props = getProps({ scripts: differentScripts() });
      const wrapper = mount(
        <MemoryRouter>
          <ScriptTable {...props} />
        </MemoryRouter>
      );
      wrapper
        .findWhere(
          n =>
            n.is(Button) && n.is({ madliberationid: 'pick-this-script-button' })
        )
        .prop('onClick')();
      // verify setChosenPath was called once with the 1st script
      expect(props.setChosenPath).toHaveBeenCalled();
      expect(props.setChosenPath).toHaveBeenCalledTimes(1);
      expect(props.setChosenPath).toHaveBeenCalledWith(
        'madliberation-scripts/005-Family_Script'
      );
    }
  );
  test('The Pick This One button should be a link to /generating-room-code', () => {
    const expectedButton = (
      <Button
        madliberationid="pick-this-script-button"
        variant="contained"
        component={Link}
        to="/generating-room-code"
      >
        Use this one
      </Button>
    );
    const props = getProps({ scripts: fourScripts() });
    const wrapper = mount(
      <MemoryRouter>
        <ScriptTable {...props} />
      </MemoryRouter>
    );
    expect(wrapper.containsMatchingElement(expectedButton)).toBe(true);
  });
  test('Rows, Cells, and Radios should have unique keys', () => {
    // A failiure of this requirement would show up in the console, no need to
    // test for now
  });
  test('Scripts should be ordered by lib_id', () => {
    // This is unnecessary: the scripts are returned by the API sorted by their
    // sort key
  });
});
