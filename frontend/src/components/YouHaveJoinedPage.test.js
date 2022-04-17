import YouHaveJoinedPage from "./YouHaveJoinedPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  findByText,
  getAllByRole,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const globalWebSocket = global.WebSocket;
afterEach(() => {
  global.WebSocket = globalWebSocket;
});
describe("YouHaveJoinedPage", () => {
  const theme = createTheme({ palette: { primary: { main: "#81181f" } } });
  test("socket message should push to the history", async () => {
    const confirmedRoomCode = "ABXXR";
    const confirmedGameName = "Sho";
    const history = { push: jest.fn() };
    const setConfirmedRoomCode = jest.fn();
    const setConfirmedGameName = jest.fn();
    let mockWebSocketConstructorCalls = 0;
    let messageEventHandler;
    const mockWebSocket = {
      addEventListener: jest.fn((eventType, cb) => {
        messageEventHandler = cb;
      }),
    };
    class MockWebSocket {
      constructor(server, protocol) {
        mockWebSocketConstructorCalls++;
        // expect server to be correct
        expect(server).toEqual(
          `wss://${window.location.hostname}/ws-wait/?` +
            `roomcode=${confirmedRoomCode}&` +
            `gamename=${encodeURIComponent(confirmedGameName)}`
        );
        return mockWebSocket;
      }
    }
    global.WebSocket = MockWebSocket;
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <YouHaveJoinedPage
            history={history}
            confirmedRoomCode={confirmedRoomCode}
            confirmedGameName={confirmedGameName}
            setConfirmedGameName={setConfirmedGameName}
            setConfirmedRoomCode={setConfirmedRoomCode}
          ></YouHaveJoinedPage>
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(mockWebSocketConstructorCalls).toEqual(1);
    messageEventHandler({ data: "assignments_ready" });
    expect(history.push).toHaveBeenCalled();
  });
});
