/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Button, Paper, TextField } from "@mui/material";
import Page from "../src/Page";

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
  const [script, setScript] = React.useState<any>();

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

        const hashChangeHandler = () => {
          // should probably create and register this in useEffect after the script is fetched
          // I think I'm enclosing some undefineds
          if (typeof window === "undefined") {
            return;
          }
          if (
            window.location.hash.split("#").length > 1 &&
            parseInt(window.location.hash.split("#")[1])
          ) {
            hashPage = parseInt(window.location.hash.split("#")[1]);
            console.log("hashPage", hashPage);
            console.log(
              "fetchScriptData.pages.length",
              fetchScriptData.pages.length
            );
            if (
              fetchScriptData &&
              fetchScriptData.pages &&
              Array.isArray(fetchScriptData.pages) &&
              hashPage <= fetchScriptData.pages.length &&
              hashPage >= 1
            ) {
              setSelectedPage(hashPage);
            }
          }
        };
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
          {pageState !== PageState.LOADING &&
            script &&
            script.pages &&
            Array.isArray(script.pages) && (
              <div>
                <div style={{ padding: "8px" }}>
                  <div>
                    <Page page={script.pages[selectedPage - 1]}></Page>
                  </div>
                  <div>
                    <Button
                      disabled={selectedPage === 1}
                      onClick={() => {
                        console.log(
                          "Previous page clicked, selectedPage",
                          selectedPage
                        );
                        if (typeof window !== "undefined") {
                          window.location.hash = `${selectedPage - 1}`;
                        }
                      }}
                    >
                      Previous page
                    </Button>{" "}
                    {`${selectedPage} / ${script.pages.length}`}{" "}
                    <Button
                      disabled={selectedPage === script.pages.length}
                      onClick={() => {
                        console.log(
                          "Next page clicked, selectedPage",
                          selectedPage
                        );
                        if (typeof window !== "undefined") {
                          window.location.hash = `${selectedPage + 1}`;
                        }
                      }}
                    >
                      Next page
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
