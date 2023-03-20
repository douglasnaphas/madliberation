/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import * as EmailValidator from "email-validator";
import { madLiberationStyles } from "../madLiberationStyles";
import ScriptMenu from "../src/ScriptMenu";
import { fetchScripts } from "../src/fetchScripts";

const ThisIsYourLinkText = (props: {
  lnk?: HTMLAnchorElement;
  yourEmail: string;
}) => {
  const { lnk, yourEmail } = props;
  if (!lnk || !yourEmail) {
    return (
      <div>
        <p>...</p>
      </div>
    );
  }
  return (
    <Typography
      component="p"
      paragraph
      gutterBottom
      style={{ marginLeft: "8px" }}
    >
      <a href={lnk.href}>This</a> is your permalink for proceeding with your
      Haggadah. Click{" "}
      <a
        href={`mailto:${yourEmail}?subject=Permalink to create my Haggadah&body=Edit the Haggadah by going to ${encodeURIComponent(
          lnk.href
        )}`}
      >
        here
      </a>{" "}
      to email this to yourself.
    </Typography>
  );
};
interface Guest {
  name: string;
  email: string;
}
const GuestList = (props: {
  guests: Array<Guest>;
  setGuests: React.Dispatch<React.SetStateAction<Array<Guest>>>;
  sederCode: string;
  pw: string;
  setRemoveParticipantError: React.Dispatch<React.SetStateAction<boolean>>;
  sederClosed: boolean;
}) => {
  const [buttonPressed, setButtonPressed] = React.useState(false);
  const {
    guests,
    setGuests,
    sederCode,
    pw,
    setRemoveParticipantError,
    sederClosed,
  } = props;
  return (
    <div>
      <Table>
        <TableBody>
          {guests.map((g) => (
            <TableRow key={`guest-row-${g.name}`}>
              <TableCell key={`guest-name-cell-${g.name}`}>{g.name}</TableCell>
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
  const [leaderEmail, setLeaderEmail] = React.useState("");
  const [guests, setGuests] = React.useState<Array<Guest>>([]);
  const [joinError, setJoinError] = React.useState(false);
  const [removeParticipantError, setRemoveParticipantError] =
    React.useState(false);
  const [confirmThatsEveryoneDialogOpen, setConfirmThatsEveryoneDialogOpen] =
    React.useState(false);
  const [yesThatsEveryoneButtonClicked, setYesThatsEveryoneButtonClicked] =
    React.useState(false);
  const [thatsEveryoneError, setThatsEveryoneError] = React.useState(false);
  const [sederClosed, setSederClosed] = React.useState(true);
  let sederCode: any, pw: any;
  if (typeof window !== "undefined" && typeof URLSearchParams === "function") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    sederCode = urlSearchParams.get("sederCode");
    pw = urlSearchParams.get("pw");
    console.log(`found sederCode ${sederCode} and pw ${pw}`);
  }
  React.useEffect(() => {
    if (sederCode && pw) {
      fetch(`../v2/leader-email?sederCode=${sederCode}&pw=${pw}`)
        .then((r) => r.json())
        .then((j) => {
          setLeaderEmail(j.leaderEmail);
        });
      fetch(`../v2/path?sederCode=${sederCode}&pw=${pw}`)
        .then((r) => r.json())
        .then((j) => {
          setPath(j.path);
        });
      fetch(`../v2/closed?sederCode=${sederCode}&pw=${pw}`)
        .then((r) => r.json())
        .then((j) => {
          if (!("closed" in j)) {
            return;
          }
          setSederClosed(j.closed as boolean);
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
            <ThisIsYourLinkText
              lnk={permalink}
              yourEmail={leaderEmail}
            ></ThisIsYourLinkText>
          </div>
          <div>
            <GuestList
              guests={guests}
              sederCode={sederCode}
              pw={pw}
            ></GuestList>
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
