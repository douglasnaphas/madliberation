/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Button, Paper, TextField } from "@mui/material";

const enum PageState {
  LOADING = 0,
  READY,
  FETCHING,
}
export default function Read() {
  const [pageState, setPageState] = React.useState(PageState.LOADING);

  let sederCode: any, rpw: any, hashPage: any;
  if (typeof window !== "undefined" && typeof URLSearchParams === "function") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    sederCode = urlSearchParams.get("sederCode");
    rpw = urlSearchParams.get("rpw");
    if (
      window.location.hash.split("#").length > 1 &&
      parseInt(window.location.hash.split("#")[1])
    ) {
      hashPage = parseInt(window.location.hash.split("#")[1]);
    }
  }
  const [selectedPage, setSelectedPage] = React.useState(hashPage);
  const hashChangeHandler = () => {
    if (typeof window === "undefined") {
      return;
    }
    if (
      window.location.hash.split("#").length > 1 &&
      parseInt(window.location.hash.split("#")[1])
    ) {
      hashPage = parseInt(window.location.hash.split("#")[1]);
      setSelectedPage(hashPage);
    }
  };
  const [script, setScript] = React.useState();

  React.useEffect(() => {
    (async () => {
      if (sederCode && rpw) {
        const fetchScriptResponse = await fetch(
          `../v2/script?sederCode=${sederCode}&rpw=${rpw}&roomcode=${sederCode}`
        );
        if (fetchScriptResponse.status !== 200) {
          return;
        }
        const fetchScriptData = await fetchScriptResponse.json();
        setScript(fetchScriptData);
        setPageState(PageState.READY);
        window.addEventListener("hashchange", hashChangeHandler);
        return () => {
          window.removeEventListener("hashchange", hashChangeHandler);
        };
      }
    })();
  }, []);
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
          <div style={{ padding: "8px" }}>
            The current page is {`${selectedPage}`}
          </div>
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
  );
}
