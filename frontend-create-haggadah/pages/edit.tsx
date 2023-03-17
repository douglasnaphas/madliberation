/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Paper } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import { madLiberationStyles } from "../madLiberationStyles";
import ScriptMenu from "../src/ScriptMenu";
import { fetchScripts } from "../src/fetchScripts";

const ThisIsYourLinkText = (props: {
  lnk?: HTMLAnchorElement;
  yourEmail: string;
}) => {
  const { lnk, yourEmail } = props;
  if (!lnk || !yourEmail) {
    return (
      <div>
        <p>No lnk or no yourEmail</p>
      </div>
    );
  }
  return (
    <Typography
      component="p"
      paragraph
      gutterBottom
      style={{ marginLeft: "8px" }}
    >
      <a href={lnk.href}>This</a> is your permalink for proceeding with your
      Haggadah. Click{" "}
      <a
        href={`mailto:${yourEmail}?subject=Permalink to create my Haggadah&body=Edit the Haggadah by going to ${encodeURIComponent(
          lnk.href
        )}`}
      >
        here
      </a>{" "}
      to email this to yourself.
    </Typography>
  );
};
export default function Edit() {
  // get the email from the server
  const [leaderEmail, setLeaderEmail] = React.useState("");
  let sederCode: any, pw: any;
  if (typeof window !== "undefined" && typeof URLSearchParams === "function") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    sederCode = urlSearchParams.get("sederCode");
    pw = urlSearchParams.get("pw");
    console.log(`found sederCode ${sederCode} and pw ${pw}`);
  }
  React.useEffect(() => {
    if (sederCode && pw) {
      fetch(`../v2/leader-email?sederCode=${sederCode}&pw=${pw}`)
        .then((r) => r.json())
        .then((j) => {
          setLeaderEmail(j.leaderEmail);
        });
    }
  }, []);
  let permalink;
  if (typeof window !== "undefined") {
    permalink = window.document.createElement("a");
    permalink.href = window.location.href;
    permalink.hash = "";
  }
  return (
    <div
      style={{
        backgroundColor: "#81181f",
        height: "100%",
        minHeight: "100%",
      }}
    >
      <div>
        <img
          css={{
            height: "200px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          src={`${MadLiberationLogo.src}`}
        ></img>
      </div>
      <Container maxWidth="md">
        <Paper>
          <div>
            <ThisIsYourLinkText
              lnk={permalink}
              yourEmail={leaderEmail}
            ></ThisIsYourLinkText>
          </div>
        </Paper>
      </Container>
      <img
        css={{
          height: "70px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        src={`${VeryAwesomePassoverLogo.src}`}
      ></img>
    </div>
  );
}
