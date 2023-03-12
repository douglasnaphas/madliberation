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
          <div></div>
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
