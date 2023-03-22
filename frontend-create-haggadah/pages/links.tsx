/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Paper, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { madLiberationStyles } from "../madLiberationStyles";

interface Participant {
  game_name: string;
  email: string;
  participant_pw: string;
}
const ParticipantList = (props: {
  participants: Array<Participant>;
  sederCode: string;
}) => {
  const { participants } = props;
  return (
    <div>
      <Table>
        <TableBody>
          {participants.map((g) => (
            <TableRow key={`guest-row-${g.game_name}`}>
              <TableCell key={`guest-name-cell-${g.game_name}`}>
                {g.game_name}
              </TableCell>
              <TableCell key={`guest-email-cell-${g.email}`}>
                {g.email}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default function Links() {
  // get the email from the server
  const [participants, setParticipants] = React.useState<Array<Participant>>(
    []
  );
  React.useState(false);
  React.useState(false);
  let sederCode: any, pw: any;
  if (typeof window !== "undefined" && typeof URLSearchParams === "function") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    sederCode = urlSearchParams.get("sederCode");
    pw = urlSearchParams.get("pw");
    console.log(`found sederCode ${sederCode} and pw ${pw}`);
  }
  React.useEffect(() => {
    if (sederCode && pw) {
      fetch(`../v2/invites?sederCode=${sederCode}&pw=${pw}&roomCode=${sederCode}`)
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
  );
}
