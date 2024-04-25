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
import { Configs } from "../src/Configs";

export default function Seders() {
  const {
    isPending: mySedersPending,
    error: mySedersError,
    data: mySedersData,
  } = useQuery({
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
  const {
    isPending: myInvitesPending,
    error: myInvitesError,
    data: myInvitesData,
  } = useQuery({
    queryKey: ["myInvites"],
    queryFn: () =>
      fetch("../v2/my-invites", { credentials: "include" }).then((res) =>
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
          <Paper id="my-seders-paper">
            {mySedersData &&
              mySedersData.map &&
              !mySedersPending &&
              !mySedersError && (
                <div style={{ padding: "10px" }}>
                  You started the following Seders. Click a link to proceed with
                  one. Anyone with the link can fully access the Seder.
                  {mySedersData.map((seder: any) => (
                    <div key={seder.room_code}>
                      <a
                        target={"_blank"}
                        href={
                          `${window.location.origin}/create-haggadah/edit.html` +
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
          <br />
          <Paper id="my-invites-paper">
            {myInvitesData &&
              myInvitesData.map &&
              !myInvitesPending &&
              !myInvitesError && (
                <div style={{ padding: "10px" }}>
                  You were invited to the following Seders. Click a link to see
                  its details and proceed with it. Anyone with the link can
                  submit answers as you.
                  {myInvitesData.map((invite: any) => (
                    <div key={invite.room_code}>
                      <a
                        target={"_blank"}
                        href={
                          `${window.location.origin}/create-haggadah/blanks.html` +
                          `?sederCode=${invite.room_code}&` +
                          `pw=${invite.participant_pw}&` +
                          `ph=${invite.ph.substring(0, Configs.PH_LENGTH)}`
                        }
                      >
                        Seder {invite.room_code.substring(0, 3)}
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
