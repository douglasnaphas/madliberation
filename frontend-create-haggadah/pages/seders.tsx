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
import CircularProgress from "@mui/material/CircularProgress";

export default function Seders() {
  const { isPending, error, data } = useQuery({
    queryKey: ["mySeders"],
    queryFn: () =>
      fetch("../v2/my-seders", { credentials: "include" }).then((res) =>
        res.json()
      ),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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
            {data && data.map && !isPending && !error && (
              <div>
                You started the following Seders. Click a link to proceed with
                one.
                {data.map((seder: any) => (
                  <div key={seder.room_code}>
                    <a
                      href={
                        `${window.location.origin}/create-haggadah/links.html` +
                        `?sederCode=${seder.room_code}&` +
                        `pw=${seder.pw}`
                      }
                    >
                      Seder {seder.room_code.substring(0, 3)}, started{" "}
                      {seder.timestamp}
                    </a>
                  </div>
                ))}
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
    </div>
  );
}
