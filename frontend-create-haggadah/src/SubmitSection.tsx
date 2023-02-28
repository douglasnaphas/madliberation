import React from "react";
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

type SubmitSectionProps = {
  getEditLink: () => Promise<{
    message?: string;
    status: number;
  }>;
  setEditLink: React.Dispatch<React.SetStateAction<string>>;
};
const SubmitSection = (props: SubmitSectionProps) => {
  const { getEditLink } = props;
  const [buttonPressed, setButtonPressed] = React.useState(false);
  return (
    <div>
      <Button
        disabled={buttonPressed}
        onClick={() => {
          setButtonPressed(true);
          getEditLink().then((r) => {
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
