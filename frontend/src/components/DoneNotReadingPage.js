import MenuAppBar from "./MenuAppBar";
import React from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

class DoneNotReadingPage extends React.Component {
  componentDidMount() {
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
  render() {
    const { confirmedRoomCode, confirmedGameName } = this.props;
    return (
      <div madliberationid="done-not-reading-page">
        <MenuAppBar
          confirmedRoomCode={confirmedRoomCode}
          confirmedGameName={confirmedGameName}
        />
        <br />
        <div>
          <Typography variant="h4" gutterBottom>
            Happy Passover!
          </Typography>
        </div>
        <div>
          <Typography component="p" paragraph>
            Enjoy the haggadah that you and your friends and family have made
            together.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/submitted"
            madliberationid={"wait-maybe-i-do-button"}
          >
            Wait, maybe I do want the script
          </Button>
        </div>
      </div>
    );
  }
}
export default DoneNotReadingPage;
