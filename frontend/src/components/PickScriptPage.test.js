import { MemoryRouter } from "react-router-dom";
import React from "react";
import { getByRole, getByText, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import PickScriptPage from "./PickScriptPage";
import ScriptTable from "./ScriptTable";

describe("<PickScriptPage />", () => {
  const fourScripts = {
    scripts: {
      Items: [
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
          haggadah_description:
            "An offensive script for only part of the family",
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
          haggadah_description:
            "A script to help you get good at Mad Liberation",
          lib_id: "script#0004",
          haggadah_short_desc: "Practice Script",
          room_code: "AAAAAD",
          path: "madliberation-scripts/004-Practice_Script",
          is_script: 1,
          haggadah_name: "0004 - Practice Script",
          script_number: 4,
        },
      ],
      Count: 4,
      ScannedCount: 4,
    },
  };
  const getFourScripts = () => {
    return new Promise((resolve, reject) => {
      resolve(fourScripts);
    });
  };
  const differentScripts = {
    scripts: {
      Items: [
        {
          haggadah_description:
            "An unoffensive script for the whole different family",
          lib_id: "script#0001",
          haggadah_short_desc: "Family Script",
          room_code: "AAAAAA",
          path: "madliberation-scripts/001-Family_Script",
          is_script: 1,
          haggadah_name: "0001 - Family Script",
          script_number: 1,
        },
        {
          haggadah_description:
            "An offensive script for a different part of the family",
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
          haggadah_description:
            "A script to help you get good at Mad Liberation",
          lib_id: "script#0004",
          haggadah_short_desc: "Practice Script",
          room_code: "AAAAAD",
          path: "madliberation-scripts/004-Practice_Script",
          is_script: 1,
          haggadah_name: "0004 - Practice Script",
          script_number: 4,
        },
      ],
      Count: 4,
      ScannedCount: 4,
    },
  };
  const getFourDifferentScripts = () => {
    return new Promise((resolve, reject) => {
      resolve(differentScripts);
    });
  };
  test("JSON from getScripts should be displayed in a table", async () => {
    render(
      <MemoryRouter>
        <PickScriptPage getScripts={getFourScripts} setChosenPath={jest.fn()} />
      </MemoryRouter>
    );
    const fourScripts = await getFourScripts();
    fourScripts.scripts.Items.forEach((script) => {
      const row = screen.getByText(script.haggadah_short_desc).closest("tr");
      expect(getByRole(row, "radio"));
      expect(getByText(row, script.haggadah_short_desc));
      expect(getByText(row, script.haggadah_description));
    });
  });
  test("JSON from getScripts should be displayed in a table 2", async () => {
    render(
      <MemoryRouter>
        <PickScriptPage
          getScripts={getFourDifferentScripts}
          setChosenPath={jest.fn()}
        />
      </MemoryRouter>
    );
    const fourScripts = await getFourDifferentScripts();
    fourScripts.scripts.Items.forEach((script) => {
      const row = screen.getByText(script.haggadah_short_desc).closest("tr");
      expect(getByRole(row, "radio"));
      expect(getByText(row, script.haggadah_short_desc));
      expect(getByText(row, script.haggadah_description));
    });
  });
});
