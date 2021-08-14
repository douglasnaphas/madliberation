import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import MenuAppBar from './MenuAppBar';
import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
});

class LetThemPressButtonPage extends Component {
  state = { fetchingPrompts: true };
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    const {
      confirmedRoomCode,
      confirmedGameName,
      setConfirmedRoomCode,
      setConfirmedGameName
    } = this.props;
    if (
      !confirmedRoomCode &&
      !confirmedGameName &&
      localStorage.getItem('roomCode') &&
      localStorage.getItem('gameName')
    ) {
      setConfirmedRoomCode(localStorage.getItem('roomCode'));
      setConfirmedGameName(localStorage.getItem('gameName'));
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
            Tell them to press their buttons!
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            The time has come to supply funny answers to leading questions.
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            Tell everyone at your seder to click the button on their phone that
            says "Click this button."
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
            to get YOUR assignments.
          </Typography>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(LetThemPressButtonPage);
