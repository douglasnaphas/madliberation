import { MemoryRouter } from "react-router-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GeneratingRoomCodePage from "./GeneratingRoomCodePage";
import { act } from "react-dom/test-utils";

describe("GeneratingRoomCodePageWithRouter", () => {
  test("should display a spinner before fetch returns", async () => {
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn(),
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = "a/b/c";
    render(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    screen.getByText("Generating a Room Code...");
    const circles = document.getElementsByTagName("circle");
    await waitFor(() => expect(circles.length).toBeGreaterThan(0));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });
  test("should fetch /room-code, user present", async () => {
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn(),
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = "a/b/c";
    render(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
          user={{
            email: "mrseff@f.com",
            nickname: "Mrs. F",
          }}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/prod/room-code", {
        method: "POST",
        body: JSON.stringify({
          path: chosenPath,
          email: "mrseff@f.com",
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
    );
  });
  test.only("should fetch /room-code, no user present", async () => {
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn(),
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = "a/b/c";
    render(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/prod/room-code", {
        method: "POST",
        body: JSON.stringify({
          path: chosenPath,
        }),
        headers: { "Content-Type": "application/json" },
      })
    );
  });
  test("should set confirmedRoomCode on successful fetch", (done) => {
    const mockSuccessResponse = { roomCode: "SUCCES" };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: true,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn(),
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = "a/b/c";
    render(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    process.nextTick(() => {
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith("SUCCES");
      global.fetch.mockClear();
      done();
    });
  });
  test("should set confirmedRoomCode on successful fetch 2", (done) => {
    const mockSuccessResponse = { roomCode: "SECOND" };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: true,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn(),
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = "a/b/c";
    render(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    process.nextTick(() => {
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith("SECOND");
      global.fetch.mockClear();
      done();
    });
  });
  test("should push onto history", (done) => {
    const mockSuccessResponse = { roomCode: "HISTOR" };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: true,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn(),
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = "a/b/c";
    render(
      <MemoryRouter>
        <GeneratingRoomCodePage
          history={history}
          setChosenPath={setChosenPath}
          chosenPath={chosenPath}
          setConfirmedRoomCode={setConfirmedRoomCode}
        ></GeneratingRoomCodePage>
      </MemoryRouter>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    process.nextTick(() => {
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledWith("/your-room-code");
      global.fetch.mockClear();
      done();
    });
  });
  test("chosenPath should be hydrated if not supplied, but present in storage, user present", (done) => {
    const mockSuccessResponse = { roomCode: "LOCALS" };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn(),
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = undefined;
    const spy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        return "script/path/from/storage";
      });
    act(() => {
      render(
        <MemoryRouter>
          <GeneratingRoomCodePage
            history={history}
            setChosenPath={setChosenPath}
            chosenPath={chosenPath}
            setConfirmedRoomCode={setConfirmedRoomCode}
            user={{
              nickname: "God of Fun",
              email: "sumslummy@raw.raw",
            }}
          ></GeneratingRoomCodePage>
        </MemoryRouter>
      );
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/prod/room-code", {
      method: "POST",
      body: JSON.stringify({
        path: "script/path/from/storage",
        email: "sumslummy@raw.raw",
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    Storage.prototype.getItem.mockClear();
    process.nextTick(() => {
      global.fetch.mockClear();
      done();
    });
  });
  test("chosenPath not received or in localStorage", (done) => {
    done();
  });
  test("fetch resolves to failed response -- should display error message", async () => {
    const mockJsonPromise = Promise.resolve({ error: "there was an error" });
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
      ok: false,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return mockFetchPromise;
    });
    const history = {
      push: jest.fn(),
    };
    const setChosenPath = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const chosenPath = "a/b/c";
    await act(async () => {
      render(
        <MemoryRouter>
          <GeneratingRoomCodePage
            history={history}
            setChosenPath={setChosenPath}
            chosenPath={chosenPath}
            setConfirmedRoomCode={setConfirmedRoomCode}
          ></GeneratingRoomCodePage>
        </MemoryRouter>
      );
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    await screen.findByText(
      /So sorry, but a Room Code could not be generated./
    );
    const links = screen.getAllByRole("link");
    expect(document.querySelector('a[href="/pick-script"]')).not.toBeNull();
    screen.getByText(
      `If this keeps happening, try a different browser or device.`
    );
    global.fetch.mockClear();
  });
  test(
    'should show a "try logging in again" message if a logged-in ' +
      "request fails for identity reasons, with option to not be logged in",
    () => {}
  );
});
