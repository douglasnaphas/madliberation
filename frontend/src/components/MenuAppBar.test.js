import { MemoryRouter } from "react-router-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import MenuAppBar from "./MenuAppBar";

describe("MenuAppBar", () => {
  test("Menu should link to Home, About, and How to Play", async () => {
    render(
      <MemoryRouter>
        <MenuAppBar />
      </MemoryRouter>
    );
    expect(
      document.querySelector('[madliberationid="menu-home-link"]')
    ).toBeNull();
    const menuLinks = [
      "Home",
      "About",
      "How to play",
      "Privacy policy",
      "Terms of service",
      "Contact us",
      "Help",
    ];
    menuLinks.forEach((menuLink) =>
      expect(screen.queryByText(menuLink)).toBeNull()
    );
    await userEvent.click(screen.getByRole("button"));
    await screen.findByText(menuLinks[0]);
    menuLinks.forEach((menuLink) =>
      expect(screen.getByText(menuLink).closest("a")).toEqual(
        screen.getByText(menuLink)
      )
    );
    return;
  });
});
