/** @jsxImportSource @emotion/react */
import React, { Component } from "react";
import Popover from "@mui/material/Popover";
import { Typography } from "@mui/material";
import { css } from "@emotion/react";

type LibProps = {
  prompt: string;
  answer: string;
};
const Lib = (props: LibProps) => {
  const { prompt, answer } = props;
  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLSpanElement) | null
  >(null);
  return (
    <span>
      <span
        style={{
          paddingLeft: "4px",
          paddingRight: "4px",
          backgroundColor: "lightgray",
        }}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        {answer}
      </span>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <Typography
          style={{
            marginBlockStart: "8px",
            marginBlockEnd: "8px",
            marginInlineStart: "8px",
            marginInlineEnd: "8px",
          }}
        >
          {prompt}
        </Typography>
      </Popover>
    </span>
  );
};
export default Lib;
