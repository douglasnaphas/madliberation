/** @jsxImportSource @emotion/react */
import Button from "@mui/material/Button";
import { madLiberationStyles } from "../madLiberationStyles";
import React from "react";
import { Typography } from "@mui/material";
import Lib from "./Lib";
import StageDirection from "./StageDirection";
import { css } from "@emotion/react";

type PageProps = {
  page: any;
};
const Page = (props: PageProps) => {
  const { page } = props;
  if (!page || !page.lines || !Array.isArray(page.lines)) {
    return <div></div>;
  }
  const lines: any[] = [];
  page.lines.forEach((line: any, lineIndex: number) => {
    const segments: any[] = [];
    if (!Array.isArray(line.segments)) {
      return;
    }
    line.segments.forEach((segment: any, segmentIndex: number) => {
      if (segment.type === "text") {
        segments.push(
          <span key={`segment-${lineIndex}-${segmentIndex}`}>
            {segment.text}
          </span>
        );
      }
      if (segment.type === "lib") {
        segments.push(
          <Lib
            prompt={segment.prompt}
            answer={segment.answer}
            key={`segment-${lineIndex}-${segmentIndex}`}
          ></Lib>
        );
      }
    });
    if (line.type === "h1") {
      lines.push(
        <Typography variant="h1" key={`line-${lineIndex}`} gutterBottom>
          {segments}
        </Typography>
      );
    }
    if (line.type === "h2") {
      lines.push(
        <Typography variant="h2" key={`line-${lineIndex}`} gutterBottom>
          {segments}
        </Typography>
      );
    }
    if (line.type === "h3") {
      lines.push(
        <Typography variant="h3" key={`line-${lineIndex}`} gutterBottom>
          {segments}
        </Typography>
      );
    }
    if (line.type === "h4") {
      lines.push(
        <Typography variant="h4" key={`line-${lineIndex}`} gutterBottom>
          {segments}
        </Typography>
      );
    }
    if (line.type === "h5") {
      lines.push(
        <Typography variant="h5" key={`line-${lineIndex}`} gutterBottom>
          {segments}
        </Typography>
      );
    }
    if (line.type === "h6") {
      lines.push(
        <Typography variant="h6" key={`line-${lineIndex}`} gutterBottom>
          {segments}
        </Typography>
      );
    }
    if (line.type === "p") {
      lines.push(
        <Typography component="p" key={`line-${lineIndex}`} paragraph>
          {segments}
        </Typography>
      );
    }
    if (line.type === "indent") {
      lines.push(
        <Typography component="p" key={`line-${lineIndex}`}>
          <span style={{ fontStyle: "italic" }}>{segments}</span>
        </Typography>
      );
      if (
        lineIndex < page.lines.length - 1 &&
        page.lines[lineIndex + 1].type !== "indent"
      ) {
        lines.push(
          <div key={`br-after-line-${lineIndex}`}>
            <br />
          </div>
        );
      }
    }
    if (line.type === "stageDirection") {
      lines.push(
        <Typography component="p" key={`line-${lineIndex}`}>
          <span
            css={css`
              background-color: lightblue;
              font-style: italic;
              font-weight: bold;
            `}
          >
            {segments}
          </span>
        </Typography>
      );
    }
  });
  return (
    <div>
      <div>
        <StageDirection>
          Read this page aloud. Click a gray box to see what the prompt was.
        </StageDirection>
      </div>
      <div>{lines}</div>
    </div>
  );
};

export default Page;
