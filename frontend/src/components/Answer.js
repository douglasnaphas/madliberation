/** @jsxImportSource @emotion/react */
import React, { Component } from "react";
import Popover from "@mui/material/Popover";
import { Typography } from "@mui/material";
import { Global, css } from "@emotion/react";
// TODO: Use styled components or the makeStyles hook instead of withStyles,
// or forego the custom formatting here
// import withStyles from '@mui/styles/withStyles';

// const styles = theme => ({
//   typography: {
//     margin: theme.spacing(1)
//   },
//   answer: {
//     paddingLeft: '4px',
//     paddingRight: '4px',
//     backgroundColor: 'lightgray'
//   }
// });

const styles = {
  ".answer": {
    paddingLeft: "4px",
    paddingRight: "4px",
    backgroundColor: "lightgray",
  },
};

class Answer extends Component {
  state = {
    anchorEl: null,
  };
  handleClick = (event) => {
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
          /* className={classes.answer}*/
          css={css`
            padding-left: 4px;
            padding-right: 4px;
            background-color: lightgray;
          `}
          onClick={this.handleClick}
          madliberationid={mlid}
          madliberationanswer="true"
        >
          {children}
        </span>
        <Popover open={open} anchorEl={anchorEl} onClose={this.handleClose}>
          <Typography css={css`
            margin-block-start: 8px;
            margin-block-end: 8px;
            margin-inline-start: 8px;
            margin-inline-end: 8px;
          `}>{prompt}</Typography>
        </Popover>
      </span>
    );
  }
}
export default Answer;
