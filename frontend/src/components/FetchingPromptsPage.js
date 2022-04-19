import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuAppBar from "./MenuAppBar";
import React, { Component } from "react";
import { Typography } from "@mui/material";
import withStyles from "@mui/styles/withStyles";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});

let webSocket;
class FetchingPromptsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingPrompts: true,
      failedFetch: false,
    };
  }
  _isMounted = false;
  messageHandler = (event) => {
    const roomCode = this.props.confirmedRoomCode;
    const gameName = this.props.confirmedGameName;
    if (!event) return;
    if (!event.data) return;
    if (event.data == "assignments_ready") {
      this.fetchAssignments(roomCode, gameName);
    }
  };
  fetchAssignments = (confirmedRoomCode, confirmedGameName) => {
    if (
      !confirmedRoomCode &&
      !confirmedGameName &&
      localStorage.getItem("roomCode") &&
      localStorage.getItem("gameName")
    ) {
      confirmedRoomCode = localStorage.getItem("roomCode");
      confirmedGameName = localStorage.getItem("gameName");
    }
    const { assignments, history, setAssignmentsData } = this.props;
    if (this._isMounted) this.setState({ fetchingPrompts: true });
    assignments(confirmedRoomCode, confirmedGameName).then((d) => {
      if (d.status === 200) {
        if (this._isMounted && Array.isArray(d.data)) {
          setAssignmentsData(d.data);
          history.push("/play");
        }
      } else {
        if (this._isMounted) {
          this.setState({ fetchingPrompts: false, failedFetch: true });
        }
      }
    });
  };
  tryAgainClick = (roomCode, gameName) => {
    return () => {
      this.fetchAssignments(roomCode, gameName);
    };
  };
  componentDidMount() {
    this._isMounted = true;
    let { confirmedRoomCode, confirmedGameName } = this.props;
    const { setConfirmedRoomCode, setConfirmedGameName } = this.props;
    if (
      !confirmedRoomCode &&
      !confirmedGameName &&
      localStorage.getItem("roomCode") &&
      localStorage.getItem("gameName")
    ) {
      confirmedRoomCode = localStorage.getItem("roomCode");
      confirmedGameName = localStorage.getItem("gameName");
      setConfirmedRoomCode(confirmedRoomCode);
      setConfirmedGameName(confirmedGameName);
    }
    this.fetchAssignments(confirmedRoomCode, confirmedGameName);
    if (confirmedRoomCode && confirmedGameName) {
      webSocket = new WebSocket(
        `wss://${window.location.hostname}/ws-wait/?` +
          `roomcode=${confirmedRoomCode}&` +
          `gamename=${encodeURIComponent(confirmedGameName)}`
      );
      webSocket.addEventListener("message", this.messageHandler);
    }
  }
  componentWillUnmount() {
    if (webSocket && webSocket.close) {
      webSocket.removeEventListener("message", this.messageHandler);
      webSocket.close();
    }
    this._isMounted = false;
  }

  render() {
    const { confirmedRoomCode, confirmedGameName } = this.props;
    return (
      <div>
        <MenuAppBar
          confirmedRoomCode={confirmedRoomCode}
          confirmedGameName={confirmedGameName}
        />
        <br />
        <div hidden={!this.state.fetchingPrompts}>
          <Typography variant="h4" gutterBottom>
            Checking for your prompts, they'll be ready promptly...
          </Typography>
          <br />
          <CircularProgress />
        </div>
        <div
          hidden={!this.state.failedFetch}
          madliberationid={"well-actually-fetching-prompts-failed"}
        >
          <Typography component="p" gutterBottom>
            So your prompts aren't ready yet. Make sure the person who started
            this Seder clicked <em>That's everyone</em> and then clicked{" "}
            <em>Yes</em>. Then
          </Typography>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={this.tryAgainClick(confirmedRoomCode, confirmedGameName)}
            >
              click this button
            </Button>
          </div>
          <div>
            <Typography component="p">
              again, or wait until this page updates with your prompts.
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(FetchingPromptsPage);
