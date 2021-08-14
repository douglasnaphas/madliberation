import React, { Component } from 'react';
import Popover from '@material-ui/core/Popover';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  typography: {
    margin: theme.spacing(1)
  },
  answer: {
    paddingLeft: '4px',
    paddingRight: '4px',
    backgroundColor: 'lightgray'
  }
});

class Answer extends Component {
  state = {
    anchorEl: null
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    const { children, prompt, classes, mlid } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <span>
        <span
          className={classes.answer}
          onClick={this.handleClick}
          madliberationid={mlid}
          madliberationanswer="true"
        >
          {children}
        </span>
        <Popover open={open} anchorEl={anchorEl} onClose={this.handleClose}>
          <Typography className={classes.typography}>{prompt}</Typography>
        </Popover>
      </span>
    );
  }
}
export default withStyles(styles)(Answer);
