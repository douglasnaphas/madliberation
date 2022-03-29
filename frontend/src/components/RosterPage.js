import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ThatsEveryoneButtonWithRouter from "./ThatsEveryoneButtonWithRouter";
import { Typography } from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});
let webSocket;

class RosterPage extends Component {
  state = {
    rosterLoading: true,
    participants: [],
    thatsEveryonePressed: false,
    thatsEveryoneFailed: false,
    dialogOpen: false,
    dialogButtonClicked: false,
  };
  _isMounted = false;
  fetchRoster = (roomCode, gameName) => {
    const f = () => {
      if (
        !roomCode &&
        !gameName &&
        localStorage.getItem("roomCode") &&
        localStorage.getItem("gameName")
      ) {
        roomCode = localStorage.getItem("roomCode");
        gameName = localStorage.getItem("gameName");
      }
      const { roster } = this.props;
      if (this._isMounted) this.setState({ rosterLoading: true });
      roster(roomCode, gameName).then((d) => {
        if (d.status === 200) {
          if (this._isMounted) {
            this.setState({
              rosterLoading: false,
              participants: d.data.participants,
            });
          }
        }
      });
    };
    return f;
  };
  closeSederAndPlay = (history) => {
    const { closeSeder, confirmedRoomCode, confirmedGameName, chosenPath } =
      this.props;
    if (this._isMounted) this.setState({ thatsEveryonePressed: true });
    closeSeder(confirmedRoomCode, confirmedGameName, chosenPath).then((d) => {
      if (!this._isMounted) return;
      if (d.status === 200) {
        history.push("/let-them-press-button");
        return;
      }
      if (this._isMounted) {
        this.setState({
          thatsEveryonePressed: false,
          thatsEveryoneFailed: true,
        });
      }
    });
  };
  messageHandler = (event) => {
    if (!event) {
      return;
    }
    if (!event.data) {
      return;
    }
    const eventData = JSON.parse(event.data);
    if (!eventData) {
      return;
    }
    if (!eventData.newParticipant) {
      return;
    }
    this.setState((state, props) => {
      if (state.participants.includes(eventData.newParticipant)) {
        return;
      }
      return {
        participants: state.participants
          .concat([eventData.newParticipant])
          .sort((a, b) => {
            if (new String(a).toLowerCase() < new String(b).toLowerCase())
              return -1;
            if (new String(a).toLowerCase() > new String(b).toLowerCase())
              return 1;
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
          }),
      };
    });
  };
  componentDidMount() {
    this._isMounted = true;
    const {
      confirmedRoomCode,
      confirmedGameName,
      chosenPath,
      setConfirmedRoomCode,
      setConfirmedGameName,
      setChosenPath,
    } = this.props;
    let roomCode = confirmedRoomCode;
    let gameName = confirmedGameName;
    let path = chosenPath;
    if (
      !roomCode &&
      !gameName &&
      !path &&
      localStorage.getItem("roomCode") &&
      localStorage.getItem("gameName") &&
      localStorage.getItem("chosenPath")
    ) {
      roomCode = localStorage.getItem("roomCode");
      setConfirmedRoomCode(roomCode);
      gameName = localStorage.getItem("gameName");
      setConfirmedGameName(gameName);
      path = localStorage.getItem("chosenPath");
      setChosenPath(path);
    }
    this.fetchRoster(roomCode, gameName)();
    webSocket = new WebSocket(
      `wss://${window.location.hostname}/ws/?` +
        `roomcode=${roomCode}&` +
        `gamename=${encodeURIComponent(gameName)}`
    );
    webSocket.addEventListener("message", this.messageHandler);
  }
  componentWillUnmount() {
    if (webSocket && webSocket.close) {
      webSocket.close();
    }
    this._isMounted = false;
  }
  onDialogClose = (event) => {
    if (this._isMounted) this.setState({ dialogOpen: false });
  };
  openDialog = () => {
    if (this._isMounted) this.setState({ dialogOpen: true });
  };
  setDialogButtonClicked = (bool) => {
    this.setState({ dialogButtonClicked: bool });
  };
  render() {
    const { confirmedRoomCode, confirmedGameName } = this.props;
    const { participants, rosterLoading } = this.state;
    const paricipantCount = this.state.participants.length;
    const rosterRows = [];
    for (let i = 0; i < paricipantCount; i++) {
      rosterRows.push(
        <TableRow key={`participantRow${participants[i]}`}>
          <TableCell
            key={`participantCell${participants[i]}`}
            madliberationid={`pc${i}`}
          >
            {participants[i]}
          </TableCell>
        </TableRow>
      );
    }
    var spinnerOrRoster;
    if (rosterLoading) {
      spinnerOrRoster = <CircularProgress />;
    } else {
      spinnerOrRoster = (
        <div>
          <Table>
            <TableBody>{rosterRows}</TableBody>
          </Table>
        </div>
      );
    }

    return (
      <div>
        <MenuAppBar
          confirmedRoomCode={confirmedRoomCode}
          confirmedGameName={confirmedGameName}
        />
        <br />
        <Typography variant="h3" gutterBottom>
          Seder Roster
        </Typography>
        <div hidden={rosterLoading}>
          <Typography variant="h3" gutterBottom>
            {paricipantCount} {paricipantCount === 1 ? "person" : "people"}
          </Typography>
          <div>
            <Typography component="p" paragraph gutterBottom>
              {paricipantCount === 1
                ? "has joined your seder (you):"
                : "have joined your seder, including you:"}
            </Typography>
          </div>
        </div>
        <div>{spinnerOrRoster}</div>
        <div hidden={rosterLoading}>
          <Typography component="p" paragraph gutterBottom>
            Is that everyone?
          </Typography>
        </div>
        <div>
          <Button
            madliberationid="no-check-again-button"
            variant="contained"
            disabled={
              this.state.rosterLoading || this.state.thatsEveryonePressed
            }
            onClick={this.fetchRoster(confirmedRoomCode, confirmedGameName)}
            color="secondary"
          >
            No, check again
          </Button>
        </div>
        <br />
        <div>
          <Button
            madliberationid="thats-everyone-button"
            onClick={this.openDialog}
            variant="contained"
            disabled={
              this.state.thatsEveryonePressed || this.state.rosterLoading
            }
          >
            That's everyone
          </Button>
        </div>
        <div hidden={!this.state.thatsEveryoneFailed}>
          <Typography component="p" color="secondary">
            There was an unexplained problem, please try again or accept our
            apologies and make a new seder after trying again many times
          </Typography>
        </div>
        <div />
        <Dialog open={this.state.dialogOpen} onClose={this.onDialogClose}>
          <DialogTitle id="confirm-thats-everyone">Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-get-script-dialog-description">
              If you click Yes, no one but the {paricipantCount}{" "}
              {paricipantCount === 1
                ? "person listed (you)"
                : "people listed (including you)"}{" "}
              will be able to join.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.onDialogClose}
              disabled={this.state.dialogButtonClicked}
            >
              Cancel
            </Button>
            <ThatsEveryoneButtonWithRouter
              closeSederAndPlay={this.closeSederAndPlay}
              setDialogButtonClicked={this.setDialogButtonClicked}
            />
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RosterPage.propTypes = {
  confirmedRoomCode: PropTypes.string,
  confirmedGameName: PropTypes.string,
  chosenPath: PropTypes.string,
  roster: PropTypes.func.isRequired,
  closeSeder: PropTypes.func.isRequired,
  setConfirmedRoomCode: PropTypes.func.isRequired,
  setConfirmedGameName: PropTypes.func.isRequired,
  setChosenPath: PropTypes.func.isRequired,
};

export default withStyles(styles)(RosterPage);
