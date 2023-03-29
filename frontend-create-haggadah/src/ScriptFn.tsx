import React from "react";
import { Typography } from '@mui/material';

type ScriptProps = {
  // script: { pages: Array<{ lines: Array<any> }> };
  script: any
};
const Script = (props: ScriptProps) => {
  const {script} = props;
  if(!Array.isArray(script.pages)) {
    return <div></div>
  }
  return <div></div>

};
export default Script;
