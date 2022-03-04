import Page from "./Page";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
  adaptV4Theme,
} from "@mui/material/styles";

describe("<Page />", () => {
  const p1 = {
    lines: [
      {
        type: "h1",
        segments: [{ type: "text", text: "A Very Practice Passover" }],
      },
      {
        type: "h4",
        segments: [
          {
            type: "text",
            text: "A safe space to learn how to play Mad Liberation",
          },
        ],
      },
      {
        type: "p",
        segments: [
          { type: "text", text: "Come, Jew, on a Jewney of liberation." },
        ],
      },
      {
        type: "h2",
        segments: [{ type: "text", text: "The bad old days" }],
      },
      {
        type: "p",
        segments: [
          {
            type: "text",
            text: "Have you ever been to a seder where someone says, “Stop looking at your phone”?",
          },
        ],
      },
      {
        type: "p",
        segments: [
          {
            type: "text",
            text: "The only thing that ruins Passover quicker than that is when someone ",
          },
          {
            type: "lib",
            id: 1,
            prompt: "does something disruptive",
            answer: "one",
          },
          { type: "text", text: "." },
        ],
      },
      {
        type: "p",
        segments: [
          {
            type: "text",
            text: "Here is another lib, coming at you like ",
          },
          {
            type: "lib",
            id: 2,
            prompt: "something fast and heavy",
            answer: "two",
          },
          { type: "text", text: "." },
        ],
      },
    ],
  };
  const theme = createTheme({ palette: { primary: { main: "#81181f" } } });

  test("full DOM rendering", async () => {
    render(
      <ThemeProvider theme={theme}>
        <Page page={p1} pageIndex={0} />
      </ThemeProvider>
    );
    const readyToReadButton = screen
      .getByText("Ready to read")
      .closest("button");
    expect(readyToReadButton).toHaveTextContent("Ready to read");
    expect(screen.queryByText("Next page")).toBeNull();
    await userEvent.click(readyToReadButton);
    expect(screen.queryByText("Ready to read")).toBeNull();
    expect(screen.getByText("Next page").closest("button")).toHaveTextContent(
      "Next page"
    );
  });
});
