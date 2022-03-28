import RosterPage from "./RosterPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { findByText, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const globalFetch = global.fetch;
const globalWebSocket = global.WebSocket;
afterEach(() => {
  global.fetch = globalFetch;
  global.WebSocket = globalWebSocket;
});
const theme = createTheme({ palette: { primary: { main: "#81181f" } } });

describe("RosterPage", () => {
  test("roster function is called on page load", async () => {
    let mockWebSocketConstructorCalls = 0;
    const mockWebSocket = {
      addEventListener: jest.fn(),
    };
    class MockWebSocket {
      constructor(server, protocol) {
        mockWebSocketConstructorCalls++;
        // expect server to be correct
        expect(server).toEqual(
          `wss://${window.location.hostname}/ws/?` +
            `roomcode=${confirmedRoomCode}&` +
            `gamename=${encodeURIComponent(confirmedGameName)}`
        );
        return mockWebSocket;
      }
    }
    global.WebSocket = MockWebSocket;
    const confirmedRoomCode = "TESTIN";
    const confirmedGameName = "Je Teste";
    const roster = jest.fn(async () => {
      return { status: 200, data: { participants: ["Je Teste"] } };
    });
    const closeSeder = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const setConfirmedGameName = jest.fn();
    const setChosenPath = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <RosterPage
            confirmedRoomCode={confirmedRoomCode}
            confirmedGameName={confirmedGameName}
            roster={roster}
            closeSeder={closeSeder}
            setConfirmedGameName={setConfirmedGameName}
            setConfirmedRoomCode={setConfirmedRoomCode}
            setChosenPath={setChosenPath}
          ></RosterPage>
        </MemoryRouter>
      </ThemeProvider>
    );
    await waitFor(() => expect(roster).toHaveBeenCalled());
  });
  test("participants from initial roster are displayed", async () => {
    let mockWebSocketConstructorCalls = 0;
    const mockWebSocket = {
      addEventListener: jest.fn(),
    };
    class MockWebSocket {
      constructor(server, protocol) {
        mockWebSocketConstructorCalls++;
        // expect server to be correct
        expect(server).toEqual(
          `wss://${window.location.hostname}/ws/?` +
            `roomcode=${confirmedRoomCode}&` +
            `gamename=${encodeURIComponent(confirmedGameName)}`
        );
        return mockWebSocket;
      }
    }
    global.WebSocket = MockWebSocket;
    const confirmedRoomCode = "TESTIN";
    const confirmedGameName = "Je Teste";
    const roster = jest.fn(async () => {
      return { status: 200, data: { participants: ["Je Teste", "Moi Too"] } };
    });
    const closeSeder = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const setConfirmedGameName = jest.fn();
    const setChosenPath = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <RosterPage
            confirmedRoomCode={confirmedRoomCode}
            confirmedGameName={confirmedGameName}
            roster={roster}
            closeSeder={closeSeder}
            setConfirmedGameName={setConfirmedGameName}
            setConfirmedRoomCode={setConfirmedRoomCode}
            setChosenPath={setChosenPath}
          ></RosterPage>
        </MemoryRouter>
      </ThemeProvider>
    );
    // We need to look in the table for Je Teste because it's also in the nav
    // bar
    let table = await screen.findByRole("table");
    await findByText(table, "Je Teste");
    await screen.findByText("Moi Too");
  });
  test("participants from subsequent roster calls are displayed", async () => {
    let mockWebSocketConstructorCalls = 0;
    const mockWebSocket = {
      addEventListener: jest.fn(),
    };
    class MockWebSocket {
      constructor(server, protocol) {
        mockWebSocketConstructorCalls++;
        // expect server to be correct
        expect(server).toEqual(
          `wss://${window.location.hostname}/ws/?` +
            `roomcode=${confirmedRoomCode}&` +
            `gamename=${encodeURIComponent(confirmedGameName)}`
        );
        return mockWebSocket;
      }
    }
    global.WebSocket = MockWebSocket;
    const confirmedRoomCode = "TESTIN";
    const confirmedGameName = "Je Teste";
    function* participantsGenerator() {
      yield ["Je Teste", "Moi Too"];
      yield ["Je Teste", "Moi Too", "Em Three"];
    }
    const pGen = participantsGenerator();
    const roster = jest.fn(async () => {
      return { status: 200, data: { participants: pGen.next().value } };
    });
    const closeSeder = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const setConfirmedGameName = jest.fn();
    const setChosenPath = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <RosterPage
            confirmedRoomCode={confirmedRoomCode}
            confirmedGameName={confirmedGameName}
            roster={roster}
            closeSeder={closeSeder}
            setConfirmedGameName={setConfirmedGameName}
            setConfirmedRoomCode={setConfirmedRoomCode}
            setChosenPath={setChosenPath}
          ></RosterPage>
        </MemoryRouter>
      </ThemeProvider>
    );
    let table = await screen.findByRole("table");
    await findByText(table, "Je Teste");
    await findByText(table, "Moi Too");
    expect(screen.queryAllByText("Em Three").length).toEqual(0);
    const checkAgainButton = screen.getByText("No, check again");
    await userEvent.click(checkAgainButton);
    table = await screen.findByRole("table");
    await findByText(table, "Je Teste");
    await findByText(table, "Moi Too");
    await findByText(table, "Em Three");
  });
  test("New participant from a WebSocket message is displayed", async () => {
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
          `wss://${window.location.hostname}/ws/?` +
            `roomcode=${confirmedRoomCode}&` +
            `gamename=${encodeURIComponent(confirmedGameName)}`
        );
        return mockWebSocket;
      }
    }
    global.WebSocket = MockWebSocket;

    const confirmedRoomCode = "TESTIN";
    const confirmedGameName = "Je Teste";
    function* participantsGenerator() {
      yield ["Je Teste", "Moi Too"];
      yield ["Je Teste", "Moi Too", "Em Three"];
    }
    const pGen = participantsGenerator();
    const roster = jest.fn(async () => {
      return { status: 200, data: { participants: pGen.next().value } };
    });
    const closeSeder = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const setConfirmedGameName = jest.fn();
    const setChosenPath = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <RosterPage
            confirmedRoomCode={confirmedRoomCode}
            confirmedGameName={confirmedGameName}
            roster={roster}
            closeSeder={closeSeder}
            setConfirmedGameName={setConfirmedGameName}
            setConfirmedRoomCode={setConfirmedRoomCode}
            setChosenPath={setChosenPath}
          ></RosterPage>
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(mockWebSocketConstructorCalls).toEqual(1);
    const testMessage = new MessageEvent("message", {
      data: `{"newParticipant":"Em Three"}`,
    });
    let table = await screen.findByRole("table");
    await findByText(table, "Je Teste");
    await findByText(table, "Moi Too");
    expect(roster).toHaveBeenCalledTimes(1);
    messageEventHandler(testMessage);
    expect(mockWebSocket.addEventListener).toHaveBeenCalled();
    await screen.findByText("Em Three");
    await findByText(table, "Em Three");
  });
  test("Duplicate participant from WebSocket", async () => {
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
          `wss://${window.location.hostname}/ws/?` +
            `roomcode=${confirmedRoomCode}&` +
            `gamename=${encodeURIComponent(confirmedGameName)}`
        );
        return mockWebSocket;
      }
    }
    global.WebSocket = MockWebSocket;

    const confirmedRoomCode = "TESTIN";
    const confirmedGameName = "Je Teste";
    function* participantsGenerator() {
      yield ["Je Teste"];
    }
    const pGen = participantsGenerator();
    const roster = jest.fn(async () => {
      return { status: 200, data: { participants: pGen.next().value } };
    });
    const closeSeder = jest.fn();
    const setConfirmedRoomCode = jest.fn();
    const setConfirmedGameName = jest.fn();
    const setChosenPath = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <RosterPage
            confirmedRoomCode={confirmedRoomCode}
            confirmedGameName={confirmedGameName}
            roster={roster}
            closeSeder={closeSeder}
            setConfirmedGameName={setConfirmedGameName}
            setConfirmedRoomCode={setConfirmedRoomCode}
            setChosenPath={setChosenPath}
          ></RosterPage>
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(mockWebSocketConstructorCalls).toEqual(1);
    const testMessage = new MessageEvent("message", {
      data: `{"newParticipant":"Je Teste"}`,
    });
    let table = await screen.findByRole("table");
    await findByText(table, "Je Teste");
    expect(roster).toHaveBeenCalledTimes(1);
    messageEventHandler(testMessage);
    expect(mockWebSocket.addEventListener).toHaveBeenCalled();
    await findByText(table, "Je Teste");
  });
});
