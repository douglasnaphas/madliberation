import React from "react";
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
const validator = require("email-validator");

type SubmitSectionProps = {
  getEditLink: (props: { path: string; leaderEmail: string }) => Promise<{
    message?: string;
    status: number;
  }>;
  leaderEmail: string;
  path: string;
  setEditLink: React.Dispatch<React.SetStateAction<string>>;
};
const SubmitSection = (props: SubmitSectionProps) => {
  const { getEditLink, path, leaderEmail } = props;
  const [buttonPressed, setButtonPressed] = React.useState(false);
  return (
    <div>
      <Button
        disabled={buttonPressed || !validator.validate(leaderEmail)}
        onClick={() => {
          setButtonPressed(true);
          getEditLink({ path, leaderEmail }).then((r) => {
            setButtonPressed(false);
          });
        }}
      >
        Submit
      </Button>
    </div>
  );
};
export default SubmitSection;
