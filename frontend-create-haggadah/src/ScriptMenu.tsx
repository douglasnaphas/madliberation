import React from "react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

interface ScriptItem {
  haggadah_description: string;
  lib_id: string;
  room_code: string;
  haggadah_short_desc: string;
  path: string;
  is_script: number;
  haggadah_name: string;
  script_number: number;
}
type ScriptItemArray = Array<ScriptItem>;
type ScriptMenuProps = {
  fetchScripts: () => Promise<{
    data?: {
      scripts: {
        Items: ScriptItemArray;
        Count: number;
        ScannedCount: number;
      };
    };
    status: number;
  }>;
  selectedScript: string;
  setSelectedScript: React.Dispatch<React.SetStateAction<string>>;
};
const ScriptMenu = (props: ScriptMenuProps) => {
  const [scripts, setScripts] = React.useState<ScriptItemArray>([]);
  const { fetchScripts, selectedScript, setSelectedScript } = props;
  useEffect(() => {
    fetchScripts().then((dataAndStatus) => {
      if (dataAndStatus?.data?.scripts?.Items) {
        setScripts(dataAndStatus.data.scripts.Items);
      }
    });
  }, []);
  const scriptRows = scripts.map((s) => {
    const scriptUid = `${s.path}`;
    return (
      <TableRow key={`row${scriptUid}`}>
        <TableCell key={`${scriptUid}-select`}>
          <Radio
            key={`${scriptUid}-radio`}
            value={`${scriptUid}`}
            id={`${scriptUid}`}
            checked={selectedScript === `${scriptUid}`}
            onChange={(event) => {
              console.log("event.target.value:");
              console.log(event.target.value);
              setSelectedScript(event.target.value);
            }}
          ></Radio>
        </TableCell>
        <TableCell key={`${scriptUid}-short-desc`}>
          <label htmlFor={`${scriptUid}`}>{s.haggadah_short_desc}</label>
        </TableCell>
        <TableCell key={`${scriptUid}-description`}>
          {s.haggadah_description}
        </TableCell>
      </TableRow>
    );
  });
  return (
    <div>
      <h3>Scripts</h3>
      <div>
        <RadioGroup name={"script"}>
          <Table>
            <TableBody>{scriptRows}</TableBody>
          </Table>
        </RadioGroup>
      </div>
    </div>
  );
};
export default ScriptMenu;
