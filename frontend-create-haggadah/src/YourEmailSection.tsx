import React from "react";
import { useState } from "react";
import { TextField, Typography } from "@mui/material";

type YourEmailSectionProps = {
  emailEditLink: () => Promise<{
    message?: string;
    status: number;
  }>;
  yourEmail: string;
  setYourEmail: React.Dispatch<React.SetStateAction<string>>;
};
const YourEmailSection = (props: YourEmailSectionProps) => {
  const { emailEditLink, yourEmail, setYourEmail } = props;
  return (
    <div>
      <div>
        <Typography component="p" paragraph gutterBottom>
          Enter <label htmlFor="your-email-address">your email address</label>
        </Typography>
      </div>
      <div>
        <TextField variant="outlined" id="your-email-address"></TextField>
      </div>
    </div>
  );
};
export default YourEmailSection;
