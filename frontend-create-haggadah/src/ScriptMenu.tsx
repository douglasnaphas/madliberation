// /** @jsxRuntime classic */
// /** @jsx jsx */

import React from "react";
import { useEffect, useState } from "react";
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
};
const ScriptMenu = (props: ScriptMenuProps) => {
  const [scripts, setScripts] = React.useState<ScriptItemArray>([]);
  const { fetchScripts } = props;
  useEffect(() => {
    fetchScripts().then((dataAndStatus) => {
      if (dataAndStatus?.data?.scripts?.Items) {
        setScripts(dataAndStatus.data.scripts.Items);
      }
    });
  }, []);
  const scriptRows = scripts.map((s) => <div>{s.haggadah_short_desc}</div>);
  return (
    <div>
      <h3>Scripts</h3>
      {scriptRows}
    </div>
  );
};
export default ScriptMenu;
