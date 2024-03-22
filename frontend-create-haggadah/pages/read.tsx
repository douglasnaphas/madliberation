/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Button, NativeSelect, Paper, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Page from "../src/Page";
import SederSummary from "../src/SederSummary";
import Head from "next/head";

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
    <div>
      {sederCode && typeof sederCode === "string" && (
        <Head>
          <title>Haggadah, Seder {sederCode.substring(0, 3)}</title>
        </Head>
      )}
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
                    <div id="page-select">
                      <FormControl>
                        <InputLabel variant="standard" htmlFor="go-to-page">
                          Go to page
                        </InputLabel>
                        <NativeSelect
                          key={selectedPage}
                          inputProps={{ name: "go-to-page", id: "go-to-page" }}
                          defaultValue={selectedPage}
                          onChange={(event) => {
                            if (typeof window !== "undefined") {
                              window.location.hash = `${event.target.value}`;
                            }
                          }}
                        >
                          {script.pages.map((p: any, i: number) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                    </div>
                    <div id="pagination">
                      <Pagination
                        key={selectedPage}
                        count={script.pages.length}
                        defaultPage={selectedPage}
                        color="primary"
                        onChange={(event, page) => {
                          console.log("event", event);
                          if (typeof window !== "undefined") {
                            window.location.hash = `${page}`;
                          }
                        }}
                        showFirstButton={true}
                        showLastButton={true}
                      ></Pagination>
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
        <div>
          {sederCode && rpw && (
            <div>
              <br />
              <Container maxWidth="md">
                <Paper>
                  <div style={{ padding: "8px" }}>
                    <SederSummary
                      sederCode={sederCode}
                      rpw={rpw}
                    ></SederSummary>
                  </div>
                </Paper>
              </Container>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
