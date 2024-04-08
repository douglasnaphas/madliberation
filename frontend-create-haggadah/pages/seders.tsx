/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Button, NativeSelect, Paper } from "@mui/material";
import SederSummary from "../src/SederSummary";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

export default function Seders() {
  
  return (
    <div>
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
          </Paper>
        </Container>
        <br></br>
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
    </div>
  );
}
