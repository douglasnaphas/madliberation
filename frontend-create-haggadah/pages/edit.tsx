/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
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
import * as EmailValidator from "email-validator";

const enum PageState {
  LOADING = 1,
  OPEN,
  CLOSED,
}
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
const GuestsForm = (props: {
  setGuests: React.Dispatch<React.SetStateAction<Array<Guest>>>;
  sederCode: string;
  pw: string;
  setJoinError: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [guestName, setGuestName] = React.useState("");
  const [guestEmail, setGuestEmail] = React.useState("");
  const [buttonPressed, setButtonPressed] = React.useState(false);
  const { setGuests, sederCode, pw, setJoinError } = props;
  return (
    <div>
      <div>
        <Typography
          component="p"
          paragraph
          gutterBottom
          style={{ marginLeft: "8px" }}
        >
          Add some guests
        </Typography>
      </div>
      <div>
        <TextField
          style={{ marginLeft: "8px" }}
          id="guest-name-input"
          label="Guest name"
          helperText="e.g., Uncle Mordecai"
          onChange={(event) => {
            setGuestName(event.target.value);
          }}
        ></TextField>
        <TextField
          style={{ marginLeft: "8px" }}
          id="guest-email-input"
          label="Guest email address"
          helperText="e.g., mordecai@uncles.com"
          onChange={(event) => {
            setGuestEmail(event.target.value);
          }}
        ></TextField>
        <Button
          disabled={buttonPressed || !EmailValidator.validate(guestEmail)}
          onClick={async () => {
            setButtonPressed(true);
            setJoinError(false);
            // backend v2 call to add guest
            const fetchInit = {
              method: "POST",
              body: JSON.stringify({
                sederCode,
                pw,
                email: guestEmail,
                gameName: guestName,
              }),
              headers: { "Content-Type": "application/json" },
            };
            const response = await fetch("../v2/join-seder", fetchInit);
            const data = await response.json();
            if (response.status !== 200) {
              setJoinError(true);
              setButtonPressed(false);
              return;
            }
            setGuests((guests) => [
              ...guests,
              { name: guestName, email: guestEmail },
            ]);
            setButtonPressed(false);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
const GuestList = (props: {
  guests: Array<Guest>;
  setGuests: React.Dispatch<React.SetStateAction<Array<Guest>>>;
  sederCode: string;
  pw: string;
  setRemoveParticipantError: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [buttonPressed, setButtonPressed] = React.useState(false);
  const { guests, setGuests, sederCode, pw, setRemoveParticipantError } = props;
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
              <Button
                disabled={buttonPressed}
                id={`remove-guest-${g.name}`}
                onClick={async () => {
                  setButtonPressed(true);
                  setRemoveParticipantError(false);
                  // backend v2 call to remove guest
                  const fetchInit = {
                    method: "POST",
                    body: JSON.stringify({
                      sederCode,
                      pw,
                      email: g.email,
                      gameName: g.name,
                    }),
                    headers: { "Content-Type": "application/json" },
                  };
                  const response = await fetch(
                    "../v2/remove-participant",
                    fetchInit
                  );
                  const data = await response.json();
                  if (response.status !== 200) {
                    setRemoveParticipantError(true);
                    setButtonPressed(false);
                    return;
                  }
                  setGuests((guests) => {
                    return guests.filter(
                      (currentGuest) =>
                        `guest-row-${g.name}` !==
                        `guest-row-${currentGuest.name}`
                    );
                  });
                  setButtonPressed(false);
                }}
              >
                Remove
              </Button>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default function Edit() {
  // get the email from the server
  const [leaderEmail, setLeaderEmail] = React.useState("");
  const [path, setPath] = React.useState("");
  const [guests, setGuests] = React.useState<Array<Guest>>([]);
  const [joinError, setJoinError] = React.useState(false);
  const [removeParticipantError, setRemoveParticipantError] =
    React.useState(false);
  const [confirmThatsEveryoneDialogOpen, setConfirmThatsEveryoneDialogOpen] =
    React.useState(false);
  const [yesThatsEveryoneButtonClicked, setYesThatsEveryoneButtonClicked] =
    React.useState(false);
  const [thatsEveryoneError, setThatsEveryoneError] = React.useState(false);
  const [pageState, setPageState] = React.useState(PageState.LOADING);
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
          if ("closed" in j && j.closed) {
            setPageState(PageState.CLOSED);
            return;
          }
          setPageState(PageState.OPEN);
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
          {pageState === PageState.OPEN && (
            <div>
              <GuestsForm
                setGuests={setGuests}
                sederCode={sederCode}
                pw={pw}
                setJoinError={setJoinError}
              ></GuestsForm>
            </div>
          )}
          {joinError && PageState.OPEN && (
            <div>
              <Typography
                component="p"
                paragraph
                gutterBottom
                style={{ color: "red" }}
              >
                Unable to add that person to your Seder
              </Typography>
            </div>
          )}
          {pageState === PageState.OPEN && (
            <div>
              <GuestList
                guests={guests}
                setGuests={setGuests}
                sederCode={sederCode}
                pw={pw}
                setRemoveParticipantError={setRemoveParticipantError}
              ></GuestList>
            </div>
          )}
          {removeParticipantError && pageState === PageState.OPEN && (
            <div>
              <Typography
                component="p"
                paragraph
                gutterBottom
                style={{ color: "red" }}
              >
                Unable to remove that person from your Seder
              </Typography>
            </div>
          )}
          {pageState === PageState.OPEN && (
            <div>
              <Button
                onClick={() => {
                  setConfirmThatsEveryoneDialogOpen(true);
                }}
              >
                That's everyone
              </Button>
              <Dialog open={confirmThatsEveryoneDialogOpen}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Your Seder has {guests.length + 1}
                    {guests.length > 0
                      ? " people, including you"
                      : " person: you"}
                    . Is that really everyone you want to add?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={yesThatsEveryoneButtonClicked}
                    onClick={async () => {
                      setYesThatsEveryoneButtonClicked(true);
                      const fetchInit = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          roomCode: sederCode,
                          sederCode,
                          pw,
                          path,
                        }),
                      };
                      const response = await fetch(
                        "../v2/close-seder",
                        fetchInit
                      );
                      if (response.status !== 200) {
                        setThatsEveryoneError(true);
                      }
                      setPageState(PageState.CLOSED);
                    }}
                  >
                    Yes, that's everyone
                  </Button>
                  <Button
                    onClick={() => {
                      setConfirmThatsEveryoneDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
              {thatsEveryoneError && (
                <div>
                  <Typography
                    component="p"
                    paragraph
                    gutterBottom
                    style={{ color: "red" }}
                  >
                    Unable to proceed, please report this error to
                    admin@passover.lol
                  </Typography>
                </div>
              )}
            </div>
          )}
          {pageState === PageState.CLOSED && permalink && (
            <div>
              <Typography component="p" paragraph gutterBottom>
                Head to {permalink.href.replace("/edit.html?", "/links.html?")}{" "}
                to get the links to send to each participant so you can all fill
                in your blanks.
              </Typography>
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
