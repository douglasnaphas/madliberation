import { MemoryRouter } from "react-router-dom";
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import YourRoomCodePage from "./YourRoomCodePage";

const getProps = ({ joinSeder, roomCode, gameName }) => {
  const props = {
    joinSeder: jest.fn(),
    setConfirmedRoomCode: jest.fn(),
    setConfirmedGameName: jest.fn(),
    confirmedRoomCode: roomCode || false,
    confirmedGameName: gameName,
  };
  if (typeof joinSeder === "function") {
    props.joinSeder = jest.fn(joinSeder);
  }
  return props;
};

describe("YourRoomCodePage", () => {
  test("confirmedRoomCode not received", () => {
    const props = getProps({});
    render(
      <MemoryRouter>
        <YourRoomCodePage {...props}></YourRoomCodePage>
      </MemoryRouter>
    );
  });
  test("chosenPath not received", () => {});
  test("confirmedRoomCode should be present in top bar", () => {});
  test("that's my name button should be disabled when input empty", () => {});
  test("one character of input should enable the button", () => {});
  test("several characters of input should leave the button enabled", () => {});
  test("the button should return to disabled after deleted input", () => {});
  test("button should be disabled during join attempt", () => {});
});
