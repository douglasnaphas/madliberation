import CircularProgress from '@mui/material/CircularProgress';
import React, { Component } from 'react';
import MenuAppBar from './MenuAppBar';
import ScriptTable from './ScriptTable';
import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

const styles = theme => ({});

class PickScriptPage extends Component {
  state = { isMounting: true };

  componentDidMount() {
    const { getScripts } = this.props;
    this._isMounted = true;
    getScripts().then(j => {
      this.setState({ scripts: j.scripts.Items });
      this.setState({ isMounting: false });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { user, setChosenPath } = this.props;
    var spinnerOrScriptMenu;
    if (this.state.isMounting) {
      spinnerOrScriptMenu = <CircularProgress />;
    } else {
      spinnerOrScriptMenu = (
        <ScriptTable
          scripts={this.state.scripts}
          setChosenPath={setChosenPath}
        />
      );
    }

    return (
      <div madliberationid="pick-your-script-page">
        <MenuAppBar user={user} />
        <div>
          <br />
          <Typography variant="h4" gutterBottom>
            Which script would you like to use?
          </Typography>
        </div>
        <div>{spinnerOrScriptMenu}</div>
      </div>
    );
  }
}

export default withStyles(styles)(PickScriptPage);
