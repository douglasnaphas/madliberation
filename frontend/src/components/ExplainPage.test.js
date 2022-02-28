import { MemoryRouter } from "react-router-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ExplainPage from "./ExplainPage";

describe("<ExplainPage />", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ExplainPage></ExplainPage>
      </MemoryRouter>
    );
  });

  test("Should render a button-link to /pick-script", () => {
    expect(screen.getByText("Proceed").closest("a")).toHaveAttribute(
      "href",
      "/pick-script"
    );
  });
});
