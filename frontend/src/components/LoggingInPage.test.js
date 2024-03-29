import LoggingInPage from "./LoggingInPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Configs } from "../Configs";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({ palette: { primary: { main: "#81181f" } } });
describe("Logging In Page", () => {
  const testData = [
    {
      desc: "normal case 1",
      expectedEmail: "strip@query.com",
      expectedNickname: "From URL",
      url: new URL(
        "https://passover.lol?email=strip%40query.com&nickname=From%20URL"
      ),
      expectedNewUrl: "https://passover.lol/",
    },
  ];
  test.each(testData)(
    "$desc",
    async ({ expectedNickname, expectedEmail, url, expectedNewUrl }) => {
      const expectedUser = {
        nickname: expectedNickname,
        email: expectedEmail,
      };
      const history = { push: jest.fn() };
      const setUser = jest.fn();
      const browserWindow = {};
      browserWindow.location = {
        href: url.href,
        search: url.search,
      };
      browserWindow.history = {
        replaceState: jest.fn().mockImplementation(() => {
          expect(history.push).not.toHaveBeenCalled();
        }),
      };
      const storage = {
        setItem: jest.fn(),
      };
      render(
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <LoggingInPage
              history={history}
              setUser={setUser}
              browserWindow={browserWindow}
              storage={storage}
            ></LoggingInPage>
          </MemoryRouter>
        </ThemeProvider>
      );
      await waitFor(() => expect(setUser).toHaveBeenCalled());
      expect(setUser).toHaveBeenCalledWith(expectedUser);
      expect(setUser).toHaveBeenCalledTimes(1);
      expect(browserWindow.history.replaceState).toHaveBeenCalledTimes(1);
      expect(browserWindow.history.replaceState).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expectedNewUrl
      );
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/");
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(storage.setItem).toHaveBeenCalled();
      expect(storage.setItem).toHaveBeenCalledWith(
        "user-nickname",
        expectedNickname
      );
      expect(storage.setItem).toHaveBeenCalledWith("user-email", expectedEmail);
      expect(storage.setItem).toHaveBeenCalledTimes(2);
    }
  );
});
// expect a "something bad happened" page if the required search params aren't
// there
