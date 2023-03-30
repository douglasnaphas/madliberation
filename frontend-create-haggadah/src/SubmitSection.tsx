import React from "react";
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
const validator = require("email-validator");

type SubmitSectionProps = {
  getEditLink: (props: {
    path: string;
    leaderEmail: string;
    leaderName: string;
  }) => Promise<{
    lnk?: string;
    status: number;
  }>;
  leaderEmail: string;
  leaderName: string;
  path: string;
  setEditLink: React.Dispatch<React.SetStateAction<string>>;
  setCreateHaggadahError: React.Dispatch<React.SetStateAction<boolean>>;
};
const SubmitSection = (props: SubmitSectionProps) => {
  const {
    getEditLink,
    path,
    leaderEmail,
    leaderName,
    setEditLink,
    setCreateHaggadahError,
  } = props;
  const [buttonPressed, setButtonPressed] = React.useState(false);
  return (
    <div>
      <Button
        disabled={
          buttonPressed ||
          !validator.validate(leaderEmail) ||
          path === "" ||
          leaderName === ""
        }
        onClick={async () => {
          if (typeof window !== "undefined") {
            setButtonPressed(true);
            const getEditLinkResponse = await getEditLink({
              path,
              leaderEmail,
              leaderName,
            });
            const permaUrl = new URL(getEditLinkResponse.lnk as string);
            const sederCode = permaUrl.searchParams.get("sederCode");
            const pw = permaUrl.searchParams.get("pw");
            const fetchInit = {
              method: "POST",
              body: JSON.stringify({
                sederCode,
                pw,
                email: leaderEmail,
                gameName: leaderName,
              }),
              headers: { "Content-Type": "application/json" },
            };
            const joinLeaderToSederResponse = await fetch(
              "../v2/join-seder",
              fetchInit
            );
            if (
              joinLeaderToSederResponse.status !== 200 ||
              getEditLinkResponse.status !== 200
            ) {
              setCreateHaggadahError(true);
            }
            setEditLink(getEditLinkResponse.lnk || "");
            if (getEditLinkResponse.lnk) {
              window.location.href = getEditLinkResponse.lnk;
            }
          }
        }}
      >
        Submit
      </Button>
    </div>
  );
};
export default SubmitSection;
