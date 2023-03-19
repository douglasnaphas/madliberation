import React from "react";
import { useState } from "react";
import { TextField, Typography } from "@mui/material";

type YourInfoSectionProps = {
  disabled?: boolean,
  yourEmail: string;
  setYourEmail: React.Dispatch<React.SetStateAction<string>>;
  yourName?: string;
  setYourName?: React.Dispatch<React.SetStateAction<string>>;
};
const YourInfoSection = (props: YourInfoSectionProps) => {
  const { disabled, yourEmail, setYourEmail } = props;
  return (
    <div>
      <div>
        <Typography component="p" paragraph gutterBottom>
          Enter <label htmlFor="your-name">your name</label> and <label htmlFor="your-email-address">your email address</label>
        </Typography>
      </div>
      <div>
        {yourName && setYourName && (<TextField
          disabled={disabled}
          variant="outlined"
          id="your-name"
          helperText="Your name"                           
          onChange={(event) => {
            setYourName(event.target.value);
          }}
        ></TextField>)}
        <TextField
          disabled={disabled}
          variant="outlined"
          id="your-email-address"
          helperText="Your email address"
          onChange={(event) => {
            setYourEmail(event.target.value);
          }}
        ></TextField>
      </div>
    </div>
  );
};
export default YourInfoSection;
