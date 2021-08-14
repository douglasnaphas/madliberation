import { Configs } from "../Configs";
import Divider from "@material-ui/core/Divider";
import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { madLiberationStyles } from "../madLiberationStyles";

import ThatsMyNameButtonWithRouter from "./ThatsMyNameButtonWithRouter";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});

class YourRoomCodePage extends Component {
  state = {
    tentativeGameName: false,
    thatsMyNameButtonPressed: false,
    failedAttempt: false,
    failureMessage: "",
  };
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    const { confirmedRoomCode, setConfirmedRoomCode } = this.props;
    if (!confirmedRoomCode && localStorage.getItem("roomCode")) {
      setConfirmedRoomCode(localStorage.getItem("roomCode"));
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  gameNameChanged = (event) => {
    event.target.value = event.target.value.replace(
      Configs.gameNameBlacklist(),
      ""
    );
    if (event.target.value.length > 0) {
      this.setState({ tentativeGameName: event.target.value });
    } else {
      this.setState({ tentativeGameName: false });
    }
  };
  joinSederAndGoToRoster = (history) => {
    const { joinSeder, setConfirmedGameName, user } = this.props;
    let { confirmedRoomCode } = this.props;
    this.setState({ thatsMyNameButtonPressed: true });
    if (!confirmedRoomCode && this.localStorage.getItem("roomCode")) {
      confirmedRoomCode = this.localStorage.getItem("roomCode");
    }
    joinSeder(confirmedRoomCode, this.state.tentativeGameName, user).then(
      (d) => {
        if (!this._isMounted) return;
        if (d.status === 200) {
          setConfirmedGameName(d.data.gameName);
          history.push("/roster");
        } else {
          this.setState({ failedAttempt: true });
          if (d.err === Configs.generic400ErrorMessage) {
            this.setState({
              failureMessage:
                "We could not join you to your own seder with that Game Name. " +
                "Please make sure it has not been more than " +
                Configs.msToJoinSeder() / 1000 / 60 +
                " minutes since you got your code, and " +
                "try again, or try a different Game Name",
            });
          } else {
            this.setState({ failureMessage: d.data.err });
          }
        }
        if (this._isMounted) this.setState({ thatsMyNameButtonPressed: false });
      }
    );
  };

  render() {
    const { confirmedRoomCode } = this.props;
    let spinnerOrRoomCode = (
      <div>
        <Typography variant="h3" gutterBottom>
          Your Room Code is:
        </Typography>
        <br />
        <Typography variant="h3" gutterBottom madliberationid="your-room-code">
          {confirmedRoomCode}
        </Typography>
        <br />
        <Typography component="p">
          Tell everyone physically at your seder to go to this site,{" "}
          <span style={madLiberationStyles.blue}>{window.location.host}</span>{" "}
          on their computer or mini-computer, click "Join a Seder", and enter
          that Room Code to join you virtually.
        </Typography>
        <br />
        <div>
          <Divider />
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            Meanwhile
          </Typography>
        </div>
        <div>
          <Typography component="p" paragraph gutterBottom>
            What's your <label htmlFor="leader-game-name">name</label>? It's how
            you, personally, will be known throughout this seder.
          </Typography>
        </div>
        <div>
          <TextField
            madliberationid="ringleader-game-name-text-field"
            helperText="your nickname this seder"
            variant="outlined"
            onChange={this.gameNameChanged}
            id="leader-game-name"
          />
        </div>
        <br />
        <div>
          <ThatsMyNameButtonWithRouter
            madliberationid="thats-my-name-button"
            joinSederAndGoToRoster={this.joinSederAndGoToRoster}
            tentativeGameName={this.state.tentativeGameName}
            thatsMyNameButtonPressed={this.state.thatsMyNameButtonPressed}
          />
        </div>
        <div
          hidden={
            !this.state.failedAttempt || this.state.thatsMyNameButtonPressed
          }
        >
          <Typography component="p" color="secondary">
            {this.state.failureMessage}
          </Typography>
        </div>
      </div>
    );

    return (
      <div madliberationid="your-room-code-page">
        <MenuAppBar confirmedRoomCode={confirmedRoomCode} />
        <br />
        {spinnerOrRoomCode}
      </div>
    );
  }
}

YourRoomCodePage.propTypes = {
  joinSeder: PropTypes.func.isRequired,
  setConfirmedRoomCode: PropTypes.func.isRequired,
  setConfirmedGameName: PropTypes.func.isRequired,
  confirmedRoomCode: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    .isRequired,
};

export default withStyles(styles)(YourRoomCodePage);
