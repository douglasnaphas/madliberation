import { MemoryRouter } from "react-router-dom";
import React from "react";
import HomePage from "./HomePage";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("<HomePage />", () => {
  const leadASederByVideoText = "Lead a seder - by video";
  const joinASederText = "Join a seder";
  const loginText = "Log in";
  const logoutText = "Log out";

  test("Should render buttons with the right links", () => {
    const storage = { removeItem: jest.fn() };
    render(
      <MemoryRouter>
        <HomePage storage={storage} />
      </MemoryRouter>
    );
    const leadASederByVideoButton = screen
      .getByText(leadASederByVideoText)
      .closest("a");
    expect(leadASederByVideoButton).toHaveTextContent(leadASederByVideoText);
    expect(leadASederByVideoButton).toHaveAttribute("href", "/explain-video");
    const joinASederButton = screen.getByText(joinASederText).closest("a");
    expect(joinASederButton).toHaveTextContent(joinASederText);
    expect(joinASederButton).toHaveAttribute("href", "/enter-room-code");
  });
  test("The Log In button should have an href to the login page", () => {
    const storage = { removeItem: jest.fn() };
    render(
      <MemoryRouter>
        <HomePage storage={storage}></HomePage>
      </MemoryRouter>
    );
    const loginButton = screen.getByText(loginText).closest("a");
    expect(loginButton).toHaveTextContent(loginText);
    expect(loginButton).toHaveAttribute("href", "/prod/login");
    expect(screen.queryByText(logoutText)).toBeNull();
  });
  test("There should be no Log Out button with an undefined user", () => {});
  test(
    "When a user is passed in as a prop, the Log Out panel should show" +
      ", instead of the Log In button",
    () => {
      const user = { nickname: "My Nick Name", email: "myemail@mail.com" };
      const storage = { removeItem: jest.fn() };
      render(
        <MemoryRouter>
          <HomePage user={user} storage={storage}></HomePage>
        </MemoryRouter>
      );
      expect(screen.queryByText(loginText)).toBeNull();
      const logoutButton = screen.getByText(logoutText).closest("button");
      expect(logoutButton).toHaveTextContent(logoutText);
      expect(screen.getByText("Logged in as My Nick Name")).toBeTruthy();
    }
  );
  test("Clicking Log Out should unset the user, clear storage", async () => {
    const user = { nickname: "My Other Nick Name", email: "other@gmail.com" };
    const setUser = jest.fn();
    const storage = { removeItem: jest.fn() };
    render(
      <MemoryRouter>
        <HomePage user={user} setUser={setUser} storage={storage}></HomePage>
      </MemoryRouter>
    );
    const logoutButton = screen.getByText(logoutText).closest("button");
    await userEvent.click(logoutButton);
    expect(setUser).toHaveBeenCalled();
    expect(setUser).toHaveBeenCalledWith(false);
    expect(storage.removeItem).toHaveBeenCalled();
    expect(storage.removeItem).toHaveBeenCalledWith("user-nickname");
    expect(storage.removeItem).toHaveBeenCalledWith("user-email");
    expect(storage.removeItem).toHaveBeenCalledWith("user-sub");
    expect(storage.removeItem).toHaveBeenCalledTimes(3);
  });
});
