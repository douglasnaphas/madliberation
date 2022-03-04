import { MemoryRouter } from "react-router-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import ExplainPage from "./ExplainPage";

const theme = createTheme({ palette: { primary: { main: "#81181f" } } });
describe("<ExplainPage />", () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <ExplainPage></ExplainPage>
        </MemoryRouter>
      </ThemeProvider>
    );
  });

  test("Should render a button-link to /pick-script", () => {
    expect(screen.getByText("Proceed").closest("a")).toHaveAttribute(
      "href",
      "/pick-script"
    );
  });
});
