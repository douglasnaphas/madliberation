import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import MenuAppBar from "./MenuAppBar";
import React, { Component } from "react";
import { Typography } from "@mui/material";

class LetThemPressButtonPage extends Component {
  state = { fetchingPrompts: true };
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    const {
      confirmedRoomCode,
      confirmedGameName,
      setConfirmedRoomCode,
      setConfirmedGameName,
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
  componentWillUnmount() {
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
            Everyone should have their prompts now!
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            The time has come to supply funny answers to leading questions.
            Everyone else at your Seder should see screens telling them to fill
            in the blanks.
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            If anyone doesn't see that, tell them to click the button that says{" "}
            <em>Click this button</em>.
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            Now you, personally,
          </Typography>
          <div>
            <Button
              madliberationid="leader-click-this-button"
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
            to get YOUR prompts.
          </Typography>
        </div>
      </div>
    );
  }
}
export default LetThemPressButtonPage;
