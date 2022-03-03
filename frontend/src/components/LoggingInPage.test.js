import LoggingInPage from "./LoggingInPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Configs } from "../Configs";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Logging In Page", () => {
  const testData = [
    {
      desc: "strip query",
      nickname: "Should",
      email: "strip@urlquery.com",
      url: "https://passover.lol?ab=cd",
      expectedUrl: "https://passover.lol",
      query: true,
      sub: "ab-cd-23-fsaf-f",
    },
    {
      desc: "query, hash",
      nickname: "Hash Too",
      email: "clean@theurl.net",
      url: "http://localhost?qu=ery#/logging-in",
      expectedUrl: "http://localhost",
      query: true,
      sub: "mla-fajkd-23-fa-d3234189v",
    },
    {
      desc: "no query, no hash",
      nickname: "No query",
      email: "abc@123a.org",
      url: "https://MLG.mlg",
      expectedUrl: "https://MLG.mlg",
      query: false,
      sub: "823mva-32jf0-324uj",
    },
    {
      desc: "hash, no query",
      nickname: "Hash",
      email: "thishas@noq.co",
      url: "https://xyz.com/#/log-in",
      expectedUrl: "https://xyz.com/$/log-in",
      query: false,
      sub: "unusualsub",
    },
  ];
  test.each(testData)(
    "$desc",
    async ({ nickname, email, url, expectedUrl, query, sub }) => {
      const expectedUser = {
        nickname,
        email,
        sub,
      };
      const history = { push: jest.fn() };
      const setUser = jest.fn();
      const browserWindow = {};
      browserWindow.location = {
        toString: () => url,
      };
      browserWindow.history = {
        replaceState: jest.fn().mockImplementation(() => {
          expect(history.push).not.toHaveBeenCalled();
        }),
      };
      global.fetch = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve({ json: jest.fn().mockImplementation(() => expectedUser) });
        });
      });
      const storage = {
        setItem: jest.fn(),
      };
      render(
        <MemoryRouter>
          <LoggingInPage
            history={history}
            setUser={setUser}
            browserWindow={browserWindow}
            storage={storage}
          ></LoggingInPage>
        </MemoryRouter>
      );
      const expectedIdUrl = new URL("/id", Configs.apiUrl());
      const expectedInit = {
        method: "GET",
        credentials: "include",
      };
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(expectedIdUrl, expectedInit);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(setUser).toHaveBeenCalled());
      expect(setUser).toHaveBeenCalledWith(expectedUser);
      expect(setUser).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/");
      expect(history.push).toHaveBeenCalledTimes(1);
      if (query) {
        expect(browserWindow.history.replaceState).toHaveBeenCalled();
        expect(browserWindow.history.replaceState).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          expectedUrl
        );
        expect(browserWindow.history.replaceState).toHaveBeenCalledTimes(1);
      } else {
        expect(browserWindow.history.replaceState).not.toHaveBeenCalled();
      }
      expect(storage.setItem).toHaveBeenCalled();
      expect(storage.setItem).toHaveBeenCalledWith(
        "user-nickname",
        expectedUser.nickname
      );
      expect(storage.setItem).toHaveBeenCalledWith(
        "user-email",
        expectedUser.email
      );
      expect(storage.setItem).toHaveBeenCalledWith(
        "user-sub",
        expectedUser.sub
      );
      expect(storage.setItem).toHaveBeenCalledTimes(3);
    }
  );
  test("fetch returns nickname only", () => {});
  test("fetch returns email only", () => {});
  test("fetch returns no nickname, no email (but succeeds)", () => {});
  test("fetch fails", () => {});
});
