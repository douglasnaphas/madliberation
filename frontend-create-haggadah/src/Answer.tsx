/** @jsxImportSource @emotion/react */
// @ts-nocheck
import React, { Component } from "react";
import Popover from "@mui/material/Popover";
import { Typography } from "@mui/material";
import { css } from "@emotion/react";

class Answer extends Component {
  state = {
    anchorEl: null,
  };
  handleClick = (event:any ) => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    const { children, prompt, mlid } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <span>
        <span
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
