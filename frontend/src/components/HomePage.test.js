import { MemoryRouter } from "react-router-dom";
import React from "react";
import HomePage from "./HomePage";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

let globalFetch = global.fetch;
afterEach(() => {
  global.fetch = globalFetch;
});

describe("<HomePage />", () => {
  const leadASederByVideoText = "Lead a seder - by video";
  const joinASederText = "Join a seder";
  const loginText = "Log in";
  const logoutText = "Log out";

  test("The Log In button should have an href to the login page", () => {
    const storage = { removeItem: jest.fn() };
    render(
      <MemoryRouter>
        <HomePage storage={storage}></HomePage>
      </MemoryRouter>
    );
    const loginButton = screen.getByText(loginText).closest("a");
    expect(loginButton).toHaveTextContent(loginText);
    expect(loginButton).toHaveAttribute("href", "/v2/login");
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
    global.fetch = jest.fn().mockImplementation((url, init) => {
      return new Promise((resolve, reject) => {
        resolve("ok");
      });
    });
    const { rerender } = render(
      <MemoryRouter>
        <HomePage user={user} setUser={setUser} storage={storage}></HomePage>
      </MemoryRouter>
    );
    const logoutButton = screen.getByText(logoutText).closest("button");
    expect(logoutButton).toBeEnabled();
    await userEvent.click(logoutButton);
    await waitFor(() =>
      expect(screen.getByText(logoutText).closest("button")).toBeDisabled()
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toEqual("/prod/logout");
    expect(global.fetch.mock.calls[0][1].credentials).toEqual("include");
    expect(logoutButton).toBeDisabled();
    await waitFor(() => expect(setUser).toHaveBeenCalled());
    expect(setUser).toHaveBeenCalledWith(false);
    expect(storage.removeItem).toHaveBeenCalled();
    expect(storage.removeItem).toHaveBeenCalledWith("user-nickname");
    expect(storage.removeItem).toHaveBeenCalledWith("user-email");
    expect(storage.removeItem).toHaveBeenCalledTimes(2);
    rerender(
      <MemoryRouter>
        <HomePage user={false} setUser={setUser} storage={storage}></HomePage>
      </MemoryRouter>
    );
    await screen.findByText(loginText);
  });
});
