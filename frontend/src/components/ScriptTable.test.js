import { MemoryRouter } from "react-router-dom";
import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Radio from "@material-ui/core/Radio";
import {
  getAllByRole,
  getByLabelText,
  getByText,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ScriptTable from "./ScriptTable";

function fourScripts() {
  return [
    {
      haggadah_description: "An unoffensive script for the whole family",
      lib_id: "script#0001",
      haggadah_short_desc: "Family Script",
      room_code: "AAAAAA",
      path: "madliberation-scripts/001-Family_Script",
      is_script: 1,
      haggadah_name: "0001 - Family Script",
      script_number: 1,
    },
    {
      haggadah_description: "An offensive script for only part of the family",
      lib_id: "script#0002",
      haggadah_short_desc: "Dirty Script",
      room_code: "AAAAAB",
      path: "madliberation-scripts/002-Dirty_Script",
      is_script: 1,
      haggadah_name: "0002 - Dirty Script",
      script_number: 2,
    },
    {
      haggadah_description: "An offensive script for the whole family",
      lib_id: "script#0003",
      haggadah_short_desc: "Dirty Family Script",
      room_code: "AAAAAC",
      path: "madliberation-scripts/003-Dirty_Family_Script",
      is_script: 1,
      haggadah_name: "0003 - Dirty Family Script",
      script_number: 3,
    },
    {
      haggadah_description: "A script to help you get good at Mad Liberation",
      lib_id: "script#0004",
      haggadah_short_desc: "Practice Script",
      room_code: "AAAAAD",
      path: "madliberation-scripts/004-Practice_Script",
      is_script: 1,
      haggadah_name: "0004 - Practice Script",
      script_number: 4,
    },
  ];
}
function differentScripts() {
  return [
    {
      haggadah_description:
        "An unoffensive script for the whole different family",
      lib_id: "script#0005",
      haggadah_short_desc: "Different Family Script",
      room_code: "AAAAAE",
      path: "madliberation-scripts/005-Family_Script",
      is_script: 1,
      haggadah_name: "0005 - Family Script",
      script_number: 5,
    },
    {
      haggadah_description:
        "An offensive script for a different part of the family",
      lib_id: "script#0007",
      haggadah_short_desc: "Dirty Script",
      room_code: "AAAAAF",
      path: "madliberation-scripts/007-Dirty_Script",
      is_script: 1,
      haggadah_name: "0007 - Dirty Script",
      script_number: 7,
    },
    {
      haggadah_description:
        "An offensive script for the whole different family",
      lib_id: "script#0008",
      haggadah_short_desc: "Dirty Family Script",
      room_code: "AAAAAG",
      path: "madliberation-scripts/008-Dirty_Family_Script",
      is_script: 1,
      haggadah_name: "0008 - Dirty Family Script",
      script_number: 8,
    },
    {
      haggadah_description: "A script to help you get good at Mad Liberation",
      lib_id: "script#0006",
      haggadah_short_desc: "Practice Script",
      room_code: "AAAAAH",
      path: "madliberation-scripts/006-Practice_Script",
      is_script: 1,
      haggadah_name: "0006 - Practice Script",
      script_number: 6,
    },
  ];
}
function getProps({ scripts }) {
  return {
    scripts,
    setChosenPath: jest.fn(),
  };
}

describe("<ScriptTable />", () => {
  test("scripts in props should appear in a table 1", () => {
    const props = getProps({ scripts: fourScripts() });
    render(
      <MemoryRouter>
        <ScriptTable {...props}></ScriptTable>
      </MemoryRouter>
    );
    fourScripts().forEach((script) => {
      const el = screen.getByLabelText(
        new RegExp(`^${script.haggadah_short_desc}$`)
      );
      expect(el).toHaveAttribute("type", "radio");
      const row = el.closest("tr");
      getByText(row, script.haggadah_description);
    });
  });
  test("scripts in props should appear in a table 2", () => {
    const props = getProps({ scripts: differentScripts() });
    render(
      <MemoryRouter>
        <ScriptTable {...props}></ScriptTable>
      </MemoryRouter>
    );
    differentScripts().forEach((script) => {
      const el = screen.getByLabelText(
        new RegExp(`^${script.haggadah_short_desc}$`)
      );
      expect(el).toHaveAttribute("type", "radio");
      const row = el.closest("tr");
      getByText(row, script.haggadah_description);
    });
  });
  test(
    "the Use This One button should call setChosenPath with the selected" +
      " script, after others have been clicked",
    async () => {
      const props = getProps({ scripts: fourScripts() });
      render(
        <MemoryRouter>
          <ScriptTable {...props} />
        </MemoryRouter>
      );
      const radioGroups = screen.getAllByRole("radiogroup");
      expect(radioGroups.length).toEqual(1);
      const radioGroup = radioGroups[0];
      const radios = screen.getAllByRole("radio");
      const radiosInGroup = getAllByRole(radioGroup, "radio");
      expect(radios.length).toEqual(radiosInGroup.length);
      expect(getByLabelText(radioGroup, "Family Script")).toBeChecked();
      await userEvent.click(screen.getByLabelText("Dirty Family Script"));
      expect(getByLabelText(radioGroup, "Dirty Family Script")).toBeChecked();
      await userEvent.click(screen.getByLabelText("Dirty Script"));
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Use this one");
      await userEvent.click(button);
      expect(props.setChosenPath).toHaveBeenCalledWith(
        "madliberation-scripts/002-Dirty_Script"
      );
    }
  );
  test(
    "the Use This One button should call setChosenPath with the selected" +
      " script 2",
    async () => {
      const props = getProps({ scripts: differentScripts() });
      render(
        <MemoryRouter>
          <ScriptTable {...props} />
        </MemoryRouter>
      );
      expect(screen.getByLabelText("Different Family Script")).toBeChecked();
      await userEvent.click(screen.getByRole("button"));
      expect(props.setChosenPath).toHaveBeenCalledWith(
        "madliberation-scripts/005-Family_Script"
      );
    }
  );
  test("The Pick This One button should be a link to /generating-room-code", () => {
    const props = getProps({ scripts: fourScripts() });
    render(
      <MemoryRouter>
        <ScriptTable {...props}></ScriptTable>
      </MemoryRouter>
    );
    expect(screen.getByText("Use this one").closest("a")).toHaveAttribute(
      "href",
      "/generating-room-code"
    );
  });
});
