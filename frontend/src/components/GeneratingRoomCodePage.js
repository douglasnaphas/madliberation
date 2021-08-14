import CircularProgress from "@material-ui/core/CircularProgress";
import { Configs } from "../Configs";
import MenuAppBar from "./MenuAppBar";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const styles = (theme) => ({});

class GeneratingRoomCodePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      failedToGetRoomCode: false,
    };
  }
  componentDidMount() {
    let { chosenPath } = this.props;
    const { history, setChosenPath, setConfirmedRoomCode, user } = this.props;
    if (!chosenPath && localStorage.getItem("chosenPath")) {
      chosenPath = localStorage.getItem("chosenPath");
      setChosenPath(chosenPath);
    }
    const roomCodeUrl = new URL("./room-code", Configs.apiUrl());
    const body = { path: chosenPath };
    if (this.props.user) body.user = user.sub;
    const fetchInit = {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    };
    if (this.props.user) fetchInit.credentials = "include";
    fetch(roomCodeUrl, fetchInit)
      .then((r) => {
        if (!r.ok) {
          throw r.status;
        }
        return r.json();
      })
      .then((j) => {
        setConfirmedRoomCode(j.roomCode);
        history.push("/your-room-code");
      })
      .catch((s) => {
        this.setState({ failedToGetRoomCode: true });
      });
  }
  render() {
    return (
      <div>
        <MenuAppBar />
        <br />
        {!this.state.failedToGetRoomCode && (
          <>
            <div>
              <Typography variant="h3">Generating a Room Code...</Typography>
            </div>
            <br />
            <div>
              <CircularProgress />
            </div>{" "}
          </>
        )}
        {this.state.failedToGetRoomCode && (
          <>
            <div>
              <div>
                <Typography variant="h5">
                  So sorry, but a Room Code could not be generated. Please start
                  over by clicking{" "}
                  <Link
                    madliberationid="room-code-error-pick-script-link"
                    to="/pick-script"
                  >
                    here
                  </Link>
                  , or refreshing the page.
                </Typography>
              </div>
              <br />
              <div>
                <Typography variant="h5">
                  If you're logged in, try going to the <Link to="/">Home</Link>{" "}
                  page, then logging out and in again.
                </Typography>
              </div>
              <div>
                <Typography variant="h5">
                  If this keeps happening, try a different browser or device.
                </Typography>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

GeneratingRoomCodePage.propTypes = {
  chosenPath: PropTypes.string,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  setChosenPath: PropTypes.func.isRequired,
  setConfirmedRoomCode: PropTypes.func.isRequired,
  user: PropTypes.shape({
    nickname: PropTypes.string,
    email: PropTypes.string,
    sub: PropTypes.string,
  }),
};

export default withStyles(styles)(GeneratingRoomCodePage);
