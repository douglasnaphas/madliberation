import CircularProgress from '@material-ui/core/CircularProgress';
import Page from './Page';
import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({});
class Script extends React.Component {
  constructor(props) {
    super(props);
    const { getStartingPageFromStorage } = props;
    this.state = {
      fetchingScript: false,
      script: false,
      pageIndex:
        getStartingPageFromStorage &&
        Number.isInteger(parseInt(localStorage.getItem('pageIndex')))
          ? parseInt(localStorage.getItem('pageIndex'))
          : 0
    };
  }
  _isMounted = false;
  getScript = (roomCode, gameName) => {
    const { script } = this.props;
    if (this._isMounted) this.setState({ fetchingScript: true });
    script(roomCode, gameName).then(d => {
      if (!this._isMounted) return;
      if (d.status === 200) {
        this.setState({ script: d.data });
      }
      this.setState({ fetchingScript: false });
    });
  };
  incrementPageIndex = () => {
    if (this._isMounted) {
      this.setState({ pageIndex: this.state.pageIndex + 1 });
    }
  };
  decrementPageIndex = () => {
    if (this._isMounted) {
      this.setState({
        pageIndex: this.state.pageIndex < 2 ? 0 : this.state.pageIndex - 1
      });
    }
  };
  goToPage0 = () => {
    if (this._isMounted) {
      this.setState({
        pageIndex: 0
      });
    }
  };
  persistState = () => {
    localStorage.setItem('pageIndex', this.state.pageIndex);
    if (this.state.script) {
      localStorage.setItem('script', JSON.stringify(this.state.script));
    }
  };
  handleVisibilityChange = () => {
    if (document.hidden) {
      this.persistState();
    }
  };
  componentDidMount() {
    this._isMounted = true;
    window.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('pagehide', this.persistState);
    const { confirmedRoomCode, confirmedGameName } = this.props;
    this.getScript(confirmedRoomCode, confirmedGameName);
  }
  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pagehide', this.persistState);
  }
  render() {
    const { confirmedRoomCode, confirmedGameName } = this.props;
    if (!confirmedRoomCode || !confirmedGameName) {
      return <div />;
    }
    if (this.state.fetchingScript) {
      return <CircularProgress />;
    }
    if (this.state.script) {
      if (
        !Array.isArray(this.state.script.pages) ||
        this.state.pageIndex >= this.state.script.pages.length
      ) {
        return (
          <div madliberationid="seder-ended-successfully" mlnoncontent="true">
            <div>
              <Typography variant="h4" gutterBottom>
                The seder has ended successfully
              </Typography>
            </div>
            <br />
            <div>
              <Typography paragraph>לשנה הבאה בירושלים</Typography>
              <Typography paragraph>Next year in Jerusalem!</Typography>
            </div>
            <br />
            <div>
              <Button variant="contained" onClick={this.goToPage0}>
                Read the script again
              </Button>
            </div>
          </div>
        );
      }

      return (
        <Page
          page={this.state.script.pages[this.state.pageIndex]}
          incrementPageIndex={this.incrementPageIndex}
          decrementPageIndex={this.decrementPageIndex}
          pageIndex={this.state.pageIndex}
          pageCount={this.state.script.pages.length}
        />
      );
    }
    return <div />;
  }
}
export default withStyles(styles)(Script);
