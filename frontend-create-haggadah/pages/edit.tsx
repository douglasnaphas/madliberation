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

export default function Edit() {
  // get the email from the server

  let permalink;
  if (typeof window !== "undefined") {
    permalink = window.document.createElement("a");
    permalink.href = window.location.origin;
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
            {" "}
            {permalink && (
              <Typography component="p" paragraph gutterBottom>
                <a href={permalink.href}>This</a> is your permalink for
                proceeding with your Haggadah. Click{" "}
                <a
                  href={`mailto:your@email.com?subject=Permalink to create my Haggadah&body=Edit the Haggadah by going to ${encodeURIComponent(
                    permalink.href
                  )}`}
                >
                  here
                </a>{" "}
                to email this to yourself.
              </Typography>
            )}
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
