import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import MenuAppBar from "./MenuAppBar";
import React, { Component } from "react";
import { Typography } from "@mui/material";
import withStyles from "@mui/styles/withStyles";

import { madLiberationStyles } from "../madLiberationStyles";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});

let webSocket;
class YouHaveJoinedPage extends Component {
  _isMounted = false;
  messageHandler = (event) => {
    if (!event) return;
    if (!event.data) return;
    if (event.data == "assignments_ready") {
      this.props.history.push("/fetching-prompts");
    }
  };
  componentDidMount() {
    console.log("YouHaveJoinedPage: componentDidMount called " + Date());
    this._isMounted = true;
    let {
      confirmedRoomCode,
      confirmedGameName,
      setConfirmedRoomCode,
      setConfirmedGameName,
      history,
    } = this.props;
    let roomCode = confirmedRoomCode;
    let gameName = confirmedGameName;
    if (
      !confirmedRoomCode &&
      !confirmedGameName &&
      localStorage.getItem("roomCode") &&
      localStorage.getItem("gameName")
    ) {
      roomCode = localStorage.getItem("roomCode");
      gameName = localStorage.getItem("gameName");
      setConfirmedRoomCode(roomCode);
      setConfirmedGameName(gameName);
    }
    if (roomCode && gameName) {
      webSocket = new WebSocket(
        `wss://${window.location.hostname}/ws-wait/?` +
          `roomcode=${roomCode}&` +
          `gamename=${encodeURIComponent(gameName)}`
      );
      webSocket.addEventListener("message", this.messageHandler);
    }
  }
  componentWillUnmount() {
    console.log("YouHaveJoinedPage: componentWillUnmount called " + Date());
    if (webSocket && webSocket.close) {
      webSocket.close();
    }
    this._isMounted = false;
  }
  render() {
    let { confirmedRoomCode, confirmedGameName } = this.props;
    return (
      <div madliberationid="you-have-joined-page">
        <MenuAppBar
          confirmedRoomCode={confirmedRoomCode}
          confirmedGameName={confirmedGameName}
        />
        <br />
        <div>
          <Typography component="p" paragraph>
            You have joined Seder{" "}
            <span style={madLiberationStyles.lightGrayBackround}>
              {confirmedRoomCode}
            </span>{" "}
            as{" "}
            <span style={madLiberationStyles.lightGrayBackround}>
              {confirmedGameName}
            </span>
            . Congratulations.
          </Typography>
          <Typography variant="h1">Wait</Typography>
          <Typography component="p" paragraph gutterBottom>
            This page will probably update with your prompts after your Seder
            leader says everyone is present. If you're bored, you can
          </Typography>
          <div>
            <Button
              madliberationid="player-click-this-button"
              color="primary"
              variant="contained"
              component={Link}
              to="/fetching-prompts"
            >
              click this button
            </Button>
          </div>
          <br />
          <Typography component="p" paragraph gutterBottom>
            to check for your prompts now.
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(YouHaveJoinedPage);
