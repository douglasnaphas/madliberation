import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuAppBar from './MenuAppBar';
import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
});

class FetchingPromptsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingPrompts: true,
      failedFetch: false
    };
  }
  _isMounted = false;
  fetchAssignments = (confirmedRoomCode, confirmedGameName) => {
    if (
      !confirmedRoomCode &&
      !confirmedGameName &&
      localStorage.getItem('roomCode') &&
      localStorage.getItem('gameName')
    ) {
      confirmedRoomCode = localStorage.getItem('roomCode');
      confirmedGameName = localStorage.getItem('gameName');
    }
    const { assignments, history, setAssignmentsData } = this.props;
    if (this._isMounted) this.setState({ fetchingPrompts: true });
    assignments(confirmedRoomCode, confirmedGameName).then(d => {
      if (d.status === 200) {
        if (this._isMounted && Array.isArray(d.data)) {
          setAssignmentsData(d.data);
          history.push('/play');
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
      localStorage.getItem('roomCode') &&
      localStorage.getItem('gameName')
    ) {
      confirmedRoomCode = localStorage.getItem('roomCode');
      confirmedGameName = localStorage.getItem('gameName');
      setConfirmedRoomCode(confirmedRoomCode);
      setConfirmedGameName(confirmedGameName);
    }
    this.fetchAssignments(confirmedRoomCode, confirmedGameName);
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
            Fetching your prompts, they'll be ready promptly...
          </Typography>
          <br />
          <CircularProgress />
        </div>
        <div hidden={!this.state.failedFetch}>
          <Typography component="p" color="secondary" gutterBottom>
            Well actually, fetching your prompts failed. Make sure the person
            who started this virtual seder really wants you to click this
            button, then try to
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
            <Typography component="p" color="secondary">
              again to get your assignments.
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}
const FetchingPromptsPageWithRouter = withRouter(FetchingPromptsPage);
export default withStyles(styles)(FetchingPromptsPageWithRouter);
