import ReadRoster from "./ReadRoster";
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
import { act } from "react-dom/test-utils";

const globalWebSocket = global.WebSocket;
afterEach(() => {
  global.WebSocket = globalWebSocket;
});
describe("ReadRoster", () => {
  const theme = createTheme({ palette: { primary: { main: "#81181f" } } });
  test("everyone done, update should be pushed", async () => {
    const confirmedRoomCode = "ABXXR";
    const confirmedGameName = "Sho";
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
          `wss://${window.location.hostname}/ws-read-roster/?` +
            `roomcode=${confirmedRoomCode}&` +
            `gamename=${encodeURIComponent(confirmedGameName)}`
        );
        return mockWebSocket;
      }
    }
    global.WebSocket = MockWebSocket;
    const requestScript = jest.fn();
    const roster = jest.fn(async () => {
      return {
        data: { done: ["rr keys"], notDone: ["keys fol"] },
        status: 200,
      };
    });
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <ReadRoster
            roster={roster}
            confirmedRoomCode={confirmedRoomCode}
            confirmedGameName={confirmedGameName}
            requestScript={requestScript}
          ></ReadRoster>
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(mockWebSocketConstructorCalls).toEqual(1);
    await act(async () => {
      messageEventHandler({ data: "read_roster_update" });
    });
  });
});
