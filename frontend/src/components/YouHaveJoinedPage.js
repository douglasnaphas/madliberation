import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import MenuAppBar from "./MenuAppBar";
import React, { Component } from "react";
import { Typography } from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import { withRouter } from "react-router-dom";

import { madLiberationStyles } from "../madLiberationStyles";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});

class YouHaveJoinedPage extends Component {
  componentDidMount() {
    let {
      confirmedRoomCode,
      confirmedGameName,
      setConfirmedRoomCode,
      setConfirmedGameName,
      history,
    } = this.props;
    if (
      !confirmedRoomCode &&
      !confirmedGameName &&
      localStorage.getItem("roomCode") &&
      localStorage.getItem("gameName")
    ) {
      setConfirmedRoomCode(localStorage.getItem("roomCode"));
      setConfirmedGameName(localStorage.getItem("gameName"));
    }
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
            until your Sederator tells you to, and then
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
            to get your assignments.
          </Typography>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(YouHaveJoinedPage));
