/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Configs } from "../src/Configs";
import Head from "next/head";

interface Participant {
  gameName: string;
  numberOfAssignments: number;
  numberOfAnswers: number;
}
const ParticipantList = (props: {
  participants: Array<Participant>;
  sederCode: string;
}) => {
  const { participants, sederCode } = props;
  return (
    <div>
      <div>
        <Table>
          <TableHead>
            <TableRow key={"read-roster-header"}>
              <TableCell>Name</TableCell>
              <TableCell>Answered</TableCell>
              <TableCell>Assigned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((g) => (
              <TableRow key={`guest-row-${g.gameName}`}>
                <TableCell key={`guest-name-cell-${g.gameName}`}>
                  <span id={`guest-name-cell-${g.gameName}`}>{g.gameName}</span>
                </TableCell>
                <TableCell key={`guest-answers-${g.gameName}`}>
                  <span id={`guest-answers-${g.gameName}`}>
                    {g.numberOfAnswers}
                  </span>
                </TableCell>
                <TableCell key={`guest-assignments-${g.gameName}`}>
                  <span id={`guest-assignments-${g.gameName}`}>
                    {g.numberOfAssignments}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default function ReadRoster() {
  // get the email from the server
  const [participants, setParticipants] = React.useState<Array<Participant>>(
    []
  );
  let sederCode: any, rpw: any;
  if (typeof window !== "undefined" && typeof URLSearchParams === "function") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    sederCode = urlSearchParams.get("sederCode");
    rpw = urlSearchParams.get("rpw");
  }
  React.useEffect(() => {
    if (sederCode && rpw) {
      fetch(
        `../v2/seder-summary?sederCode=${sederCode}&rpw=${rpw}&roomcode=${sederCode}`
      )
        .then((r) => r.json())
        .then((j) => {
          if (j.participants) {
            setParticipants(j.participants);
          }
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
    <div>
      {sederCode && typeof sederCode === "string" && (
        <Head>
          <title>Progress, Seder {sederCode.substring(0, 3)}</title>
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
            <div>
              <ParticipantList
                participants={participants}
                sederCode={sederCode}
              ></ParticipantList>
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
    </div>
  );
}
