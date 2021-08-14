import React, { Component } from 'react';
import MenuAppBar from './MenuAppBar';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
});

class HowToPlay extends Component {
  render() {
    return (
      <div>
        <MenuAppBar />
        <div madliberationid="how-to-play-page">
          <br />
          <Typography variant="h2" gutterBottom>
            How to Play
          </Typography>
          <Typography component="p">
            Mad Liberation is a game of seeking freedom through imagination and
            creativity
          </Typography>
          <br />
          <Typography component="p">
            Do as you're told on each screen.
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HowToPlay);
