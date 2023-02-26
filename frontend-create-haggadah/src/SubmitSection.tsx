import React from "react";
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

type SubmitSectionProps = {
  emailEditLink: () => Promise<{
    message?: string;
    status: number;
  }>;
};
const SubmitSection = (props: SubmitSectionProps) => {
  const { emailEditLink } = props;
  const [buttonPressed, setButtonPressed] = React.useState(false);
  return (
    <div>
      <Button
        disabled={buttonPressed}
        onClick={() => {
          setButtonPressed(true);
          emailEditLink().then((r) => {
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
