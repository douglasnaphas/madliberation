/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Paper, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Configs } from "../src/Configs";

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
      <Typography
        component="p"
        paragraph
        gutterBottom
        style={{ marginLeft: "8px" }}
      >
        Send each participant their personalized permalink, shown below, so they
        can fill in their blanks.
      </Typography>
      <div>
        <Table>
          <TableBody>
            {participants.map((g) => (
              <TableRow key={`guest-row-${g.game_name}`}>
                <TableCell key={`guest-name-cell-${g.game_name}`}>
                  {g.gameName}
                </TableCell>
                <TableCell key={`guest-answers-${g.game_name}`}>
                  {g.numberOfAnswers}
                </TableCell>
                <TableCell key={`guest-assignments-${g.game_name}`}>
                  {g.numberOfAssignments}
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
