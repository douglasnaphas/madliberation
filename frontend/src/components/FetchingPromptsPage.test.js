import FetchingPromptsPage from "./FetchingPromptsPage";
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
describe("FetchingPromptsPage", () => {
  const theme = createTheme({ palette: { primary: { main: "#81181f" } } });
  test("socket message should push to the history", async () => {
    const testAssignmentData = [
      { id: 7, sentence: "Let’s use __.", prompt: "archaic machines" },
      {
        id: 9,
        sentence: "She would __",
        prompt: "take a conspicuous action",
        example: "quack like a duck",
      },
      {
        id: 8,
        sentence: "We will write on __.",
        prompt: "things you could technically write on",
        example: "bananas",
      },
      { id: 12, sentence: "That day is __.", prompt: "a holiday" },
      { id: 2, sentence: "This is _", prompt: "something fast and heavy" },
      { id: 10, prompt: "tech buzz word", example: "Big Data" },
    ];
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
    const mockAssignments = jest.fn(async () => {
      return { data: testAssignmentData, status: 200 };
    });
    const mockSetAssignmentsData = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <FetchingPromptsPage
            history={history}
            confirmedRoomCode={confirmedRoomCode}
            confirmedGameName={confirmedGameName}
            setConfirmedGameName={setConfirmedGameName}
            setConfirmedRoomCode={setConfirmedRoomCode}
            assignments={mockAssignments}
            setAssignmentsData={mockSetAssignmentsData}
          ></FetchingPromptsPage>
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(mockWebSocketConstructorCalls).toEqual(1);
    messageEventHandler({ data: "assignments_ready" });
    await waitFor(() => expect(history.push).toHaveBeenCalled());
  });
});
