/** @jsxImportSource @emotion/react */
// @ts-nocheck
import React, { Component } from "react";
import { css } from "@emotion/react";

class StageDirection extends Component {
  render() {
    const { children, sayStageDirection } = this.props;
    return (
      <span
        css={css`
          background-color: lightblue;
          font-style: italic;
          font-weight: bold;
        `}
      >
        {(sayStageDirection ? "[Don't read this]:" : "") + children}
      </span>
    );
  }
}
export default StageDirection;
