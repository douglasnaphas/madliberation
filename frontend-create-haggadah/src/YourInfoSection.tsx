import React from "react";
import { useState } from "react";
import { TextField, Typography } from "@mui/material";

type YourInfoSectionProps = {
  disabled?: boolean,
  yourEmail: string;
  setYourEmail: React.Dispatch<React.SetStateAction<string>>;
};
const YourInfoSection = (props: YourInfoSectionProps) => {
  const { disabled, yourEmail, setYourEmail } = props;
  return (
    <div>
      <div>
        <Typography component="p" paragraph gutterBottom>
          Enter <label htmlFor="your-email-address">your email address</label>
        </Typography>
      </div>
      <div>
        <TextField
          disabled={disabled}
          variant="outlined"
          id="your-email-address"
          onChange={(event) => {
            setYourEmail(event.target.value);
          }}
        ></TextField>
      </div>
    </div>
  );
};
export default YourInfoSection;
