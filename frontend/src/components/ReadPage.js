import React, { Component } from 'react';
import ReadRoster from './ReadRoster';
import MenuAppBar from './MenuAppBar';
import Script from './Script';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
});

class ReadPage extends Component {
  constructor(props) {
    super(props);
    const { confirmedRoomCode, confirmedGameName } = this.props;
    const getStartingPageFromStorage =
      !confirmedRoomCode &&
      !confirmedGameName &&
      localStorage.getItem('pageIndex');
    this.state = {
      readyForScript: false,
      getStartingPageFromStorage: getStartingPageFromStorage
    };
  }
  _isMounted = false;
  requestScript = () => {
    if (this._isMounted) {
      this.setState({ readyForScript: true });
    }
  };
  beforeUnload = () => {
    if (!this.state.readyForScript) {
      localStorage.removeItem('pageIndex');
    }
  };
  handleVisibilityChange = () => {
    if (document.hidden) {
      this.beforeUnload();
    }
  };
  componentDidMount() {
    this._isMounted = true;
    window.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('pagehide', this.beforeUnload);
    const { setConfirmedRoomCode, setConfirmedGameName } = this.props;
    let { confirmedRoomCode, confirmedGameName } = this.props;
    if (
      !confirmedRoomCode &&
      !confirmedGameName &&
      localStorage.getItem('roomCode') &&
      localStorage.getItem('gameName')
    ) {
      confirmedRoomCode = localStorage.getItem('roomCode');
      setConfirmedRoomCode(confirmedRoomCode);
      confirmedGameName = localStorage.getItem('gameName');
      setConfirmedGameName(confirmedGameName);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pagehide', this.beforeUnload);
  }
  render() {
    const { confirmedRoomCode, confirmedGameName, roster, script } = this.props;
    const readRoster = this.state.readyForScript ? (
      <div />
    ) : (
      <ReadRoster
        roster={roster}
        confirmedRoomCode={confirmedRoomCode}
        confirmedGameName={confirmedGameName}
        requestScript={this.requestScript}
      />
    );
    const scriptComponent = this.state.readyForScript ? (
      <Script
        script={script}
        confirmedRoomCode={confirmedRoomCode}
        confirmedGameName={confirmedGameName}
        getStartingPageFromStorage={this.state.getStartingPageFromStorage}
      />
    ) : (
      <div />
    );
    return (
      <div>
        <MenuAppBar
          confirmedRoomCode={confirmedRoomCode}
          confirmedGameName={confirmedGameName}
        />
        <br />
        {readRoster}
        {scriptComponent}
      </div>
    );
  }
}

export default withStyles(styles)(ReadPage);
