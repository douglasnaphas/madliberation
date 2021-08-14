import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import MenuAppBar from "./MenuAppBar";
import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});

class SubmittedPage extends Component {
  state = {};
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    const {
      confirmedRoomCode,
      confirmedGameName,
      setConfirmedGameName,
      setConfirmedRoomCode,
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
        <div>
          <Typography variant="h4" gutterBottom>
            You submitted your answers!
          </Typography>
        </div>
        <div>
          <Typography component="p" paragraph gutterBottom>
            You've done your part for this seder. Your answers will be plugged
            into the script in funny places. Now, a question:
          </Typography>
        </div>
        <div>
          <Typography variant="h4" gutterBottom>
            Do you want to read the haggadah from this device?
          </Typography>
        </div>
        <div>
          <Typography component="p" paragraph gutterBottom>
            It's usually best to click "Yes" and get the script on your device,
            so you can follow along.
          </Typography>
        </div>
        <div>
          <Button
            madliberationid="i-want-the-script-button"
            variant="contained"
            component={Link}
            to="/read"
          >
            Yes, I want the script
          </Button>{" "}
        </div>
        <br />
        <div>
          <Button
            madliberationid="use-someone-elses-device-button"
            variant="contained"
            component={Link}
            to="/done-not-reading"
          >
            No, we'll use someone else's device
          </Button>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(SubmittedPage);
