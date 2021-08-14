import SedersPage from "./SedersPage";
import { createMount } from "@material-ui/core/test-utils";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";

let mount;
let globalFetch = global.fetch;

beforeEach(() => {
  mount = createMount();
});
afterEach(() => {
  mount.cleanUp();
  global.fetch = globalFetch;
});

describe("SedersPage", () => {
  const selectSederByRoomCode = (wrapper, roomCode) => {
    expect(
      wrapper
        .findWhere((n) => n.is(Radio) && n.is(`#radio-${roomCode}`))
        .exists()
    ).toBe(true);
    act(() => {
      wrapper
        .findWhere((n) => n.is(Radio) && n.is(`#radio-${roomCode}`))
        .prop("onChange")({
        target: { value: `${roomCode}` },
      });
      wrapper.update();
    });
  };
  describe("Re-join Case 1: user started the seder, non-closed, user un-named", () => {
    // should drop the user back at /your-room-code
    test("user rejoins an open seder 1", async () => {
      const user = {
        email: "user1@gmail.com",
        nickname: "Mister One",
        sub: "11-aa-m1-gha-one",
      };
      const setConfirmedRoomCode = jest.fn();
      const setChosenPath = jest.fn();

      const sedersStarted = [
        {
          created: 1585970508141,
          lib_id: "seder",
          room_code: "IJYAQX",
          path: "madliberation-scripts/005-Practice_Script",
          user_email: "user1@gmail.com",
          timestamp: "2020-04-04T03:21:48.141Z",
        },
        {
          created: 1585973347633,
          lib_id: "seder",
          room_code: "ZLSXQA",
          path: "madliberation-scripts/006-Practice_Script",
          user_email: "user1@gmail.com",
          timestamp: "2020-04-04T04:09:07.633Z",
        },
        {
          created: 1585963851309,
          lib_id: "seder",
          room_code: "GMKMNB",
          path: "madliberation-scripts/007-Practice_Script",
          user_email: "user1@gmail.com",
          timestamp: "2020-04-04T01:30:51.309Z",
        },
      ];
      const sedersJoined = [];
      global.fetch = jest.fn().mockImplementation((url, init) => {
        if (
          url.pathname === "/prod/seders" ||
          url.pathname === "/seders-started"
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersStarted };
              }),
            });
          });
        }
        if (url.pathname === "/prod/seders-joined") {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersJoined };
              }),
            });
          });
        }
      });
      const history = { push: jest.fn() };
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <SedersPage
              history={history}
              user={user}
              setConfirmedRoomCode={setConfirmedRoomCode}
              setChosenPath={setChosenPath}
            ></SedersPage>
          </MemoryRouter>
        );
      });
      expect(global.fetch).toHaveBeenCalled();
      wrapper.update();
      expect(wrapper.findWhere((n) => n.is(Button)).exists()).toBe(true);
      selectSederByRoomCode(wrapper, "ZLSXQA");
      wrapper.update();
      act(() => {
        const button = wrapper.findWhere(
          (n) => n.is(Button) && n.is("#resume-this-seder-button")
        );
        button.prop("onClick")();
      });
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith("ZLSXQA");
      expect(setChosenPath).toHaveBeenCalled();
      expect(setChosenPath).toHaveBeenCalledTimes(1);
      expect(setChosenPath).toHaveBeenCalledWith(
        "madliberation-scripts/006-Practice_Script"
      );
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/your-room-code");
    });
  });
  describe("Re-join Case 2: user started the seder, non-closed, user named", () => {
    // user has a confirmed game name, but has not yet clicked "that's everyone"
    // get a game name cookie, restore state, and send them to /roster
    test("user started some, joined some, 1 overlap", async () => {
      const userEmail = "munmunny@gmail.com";
      const selectedRoomCode = "MMEMUN";
      const selectedGameName = "madame un";
      const userSub = "222-case2-thisiscase-2-x";
      const selectedPath = "xxx-madliberation-scripts/007-Practice_Script";
      const user = {
        email: userEmail,
        nickname: selectedGameName,
        sub: userSub,
      };
      const setConfirmedRoomCode = jest.fn();
      const setChosenPath = jest.fn();
      const setConfirmedGameName = jest.fn();
      const sedersStarted = [
        {
          created: 1585970508141,
          lib_id: "seder",
          room_code: "LFEJIK",
          path: "madliberation-scripts/002-Practice_Script",
          user_email: userEmail,
          timestamp: "2020-04-04T03:21:48.141Z",
        },
        {
          created: 1585973347633,
          lib_id: "seder",
          room_code: "RLSXQA",
          path: "madliberation-scripts/006-Practice_Script",
          user_email: userEmail,
          timestamp: "2020-04-04T04:09:07.633Z",
        },
        {
          created: 1585963851309,
          lib_id: "seder",
          room_code: selectedRoomCode,
          path: selectedPath,
          user_email: userEmail,
          timestamp: "2020-04-04T01:30:51.309Z",
        },
      ];
      const sedersJoined = [
        {
          lib_id:
            "participant#thiswillactuallybesomethinglikethefirst64charsofthehashofthegamename",
          room_code: selectedRoomCode,
          user_email: userEmail,
          game_name: selectedGameName,
        },
        {
          lib_id:
            "participant#4ormaybeitsthewholehash34890fjalfds239ftheg4u398poda",
          room_code: "FFEMUN",
          user_email: userEmail,
          game_name: "custom name",
        },
        {
          lib_id: "participant#kf83q90jflakehash34890fjalfds239ftheg4u398poda",
          room_code: "NONOVE",
          user_email: userEmail,
          game_name: selectedGameName,
        },
      ];
      const expectedRejoinInit = {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGameName,
          roomCode: selectedRoomCode,
          user: userSub,
        }),
      };
      global.fetch = jest.fn().mockImplementation((url, init) => {
        const postData =
          init && init.body && init.body.length && JSON.parse(init.body);
        if (
          url.pathname === "/prod/seders" ||
          url.pathname === "/seders-started"
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersStarted };
              }),
            });
          });
        }
        if (url.pathname === "/prod/seders-joined") {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersJoined };
              }),
            });
          });
        }
        if (
          url.pathname === "/prod/rejoin" &&
          postData &&
          postData.roomCode &&
          postData.roomCode === selectedRoomCode &&
          postData.gameName &&
          postData.gameName === selectedGameName
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return {
                  gameName: selectedGameName,
                  roomCode: selectedRoomCode,
                  result: "success",
                };
              }),
            });
          });
        }
        return new Promise((resolve, reject) => {
          reject({ err: "bad fetch" });
        });
      });
      const history = { push: jest.fn() };
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <SedersPage
              history={history}
              user={user}
              setConfirmedRoomCode={setConfirmedRoomCode}
              setChosenPath={setChosenPath}
              setConfirmedGameName={setConfirmedGameName}
            ></SedersPage>
          </MemoryRouter>
        );
      });
      expect(global.fetch).toHaveBeenCalled();
      wrapper.update();
      expect(wrapper.findWhere((n) => n.is(Button)).exists()).toBe(true);
      selectSederByRoomCode(wrapper, selectedRoomCode);
      wrapper.update();
      await act(async () => {
        const button = wrapper.findWhere(
          (n) => n.is(Button) && n.is("#resume-this-seder-button")
        );
        await button.prop("onClick")();
      });
      wrapper.update();
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith(selectedRoomCode);
      expect(setChosenPath).toHaveBeenCalled();
      expect(setChosenPath).toHaveBeenCalledTimes(1);
      expect(setChosenPath).toHaveBeenCalledWith(selectedPath);
      expect(setConfirmedGameName).toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalledTimes(1);
      expect(setConfirmedGameName).toHaveBeenCalledWith(selectedGameName);
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/roster");
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch.mock.calls[2][0].pathname).toEqual("/prod/rejoin");
      expect(global.fetch.mock.calls[2][1]).toEqual(expectedRejoinInit);
    });
    test("multiple overlapping seders", () => {});
  });
  describe("Re-join Case 3: user did not start the seder, non-closed", () => {
    // user must have been named (must have gotten their game name confirmed)
    // if they are in a seder that they did not start
    // get a game name cookie, restore state, and send them to /you-have-joined
    test("user started some, joined some others (disjoint sets)", async () => {
      const userEmail = "funfunny@yahoo.co";
      const selectedRoomCode = "FFUNNY";
      const selectedGameName = "Lapid Sprull";
      const userSub = "mr3mr3-case3-maybethereareother-cases";
      const selectedPath = "xxx-madliberation-scripts/010-Three_Script";
      const user = {
        email: userEmail,
        nickname: selectedGameName,
        sub: userSub,
      };
      const setConfirmedRoomCode = jest.fn();
      const setChosenPath = jest.fn();
      const setConfirmedGameName = jest.fn();
      const sedersStarted = [
        {
          created: 1585970508141,
          lib_id: "seder",
          room_code: "MXIJIK",
          path: "madliberation-scripts/002-Practice_Script",
          user_email: userEmail,
          timestamp: "2020-04-04T03:21:48.141Z",
        },
        {
          created: 1585973347633,
          lib_id: "seder",
          room_code: "TIYXQA",
          path: "madliberation-scripts/006-Practice_Script",
          user_email: userEmail,
          timestamp: "2020-04-04T04:09:07.633Z",
        },
        {
          created: 1585963851309,
          lib_id: "seder",
          room_code: "OTHERR",
          path: selectedPath,
          user_email: userEmail,
          timestamp: "2020-04-04T01:30:51.309Z",
        },
      ];
      const sedersJoined = [
        {
          lib_id:
            "participant#84849343tuallybesomethinglikethefirst64charsofthehashofth00",
          room_code: "MORXLY",
          user_email: userEmail,
          game_name: selectedGameName,
        },
        {
          lib_id:
            "participant#uruuururthewholehash34890fjalfds239ftheg4u398poda",
          room_code: "SYRXUR",
          user_email: userEmail,
          game_name: "custom XYR name",
        },
        {
          lib_id: "participant#123fweretlakehash34890fjalfds239ftheg4u398poda",
          room_code: selectedRoomCode,
          user_email: userEmail,
          game_name: selectedGameName,
        },
      ];
      const expectedRejoinInit = {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGameName,
          roomCode: selectedRoomCode,
          user: userSub,
        }),
      };
      global.fetch = jest.fn().mockImplementation((url, init) => {
        const postData =
          init && init.body && init.body.length && JSON.parse(init.body);
        if (
          url.pathname === "/prod/seders" ||
          url.pathname === "/seders-started"
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersStarted };
              }),
            });
          });
        }
        if (url.pathname === "/prod/seders-joined") {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersJoined };
              }),
            });
          });
        }
        if (
          url.pathname === "/prod/rejoin" &&
          postData &&
          postData.roomCode &&
          postData.roomCode === selectedRoomCode &&
          postData.gameName &&
          postData.gameName === selectedGameName
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return {
                  gameName: selectedGameName,
                  roomCode: selectedRoomCode,
                  result: "success",
                };
              }),
            });
          });
        }
        return new Promise((resolve, reject) => {
          reject({ err: "bad fetch" });
        });
      });
      const history = { push: jest.fn() };
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <SedersPage
              history={history}
              user={user}
              setConfirmedRoomCode={setConfirmedRoomCode}
              setChosenPath={setChosenPath}
              setConfirmedGameName={setConfirmedGameName}
            ></SedersPage>
          </MemoryRouter>
        );
      });
      expect(global.fetch).toHaveBeenCalled();
      wrapper.update();
      expect(wrapper.findWhere((n) => n.is(Button)).exists()).toBe(true);
      selectSederByRoomCode(wrapper, selectedRoomCode);
      wrapper.update();
      await act(async () => {
        const button = wrapper.findWhere(
          (n) => n.is(Button) && n.is("#resume-this-seder-button")
        );
        await button.prop("onClick")();
      });
      wrapper.update();
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith(selectedRoomCode);
      expect(setChosenPath).not.toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalledTimes(1);
      expect(setConfirmedGameName).toHaveBeenCalledWith(selectedGameName);
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/you-have-joined");
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch.mock.calls[2][0].pathname).toEqual("/prod/rejoin");
      expect(global.fetch.mock.calls[2][1]).toEqual(expectedRejoinInit);
    });
  });
  describe("Re-join Case 4: seder closed, leader, assignments not populated", () => {
    // get a game name cookie, restore state, send them to /let-them-press-buttons
    test("multiple overlaps", async () => {
      const userEmail = "multiple_overlaps@ab.cz";
      const selectedRoomCode = "DUNLOP";
      const selectedGameName = "Sply";
      const userSub = "abx778-case4-treeof-treeof-4";
      const selectedPath = "44-madliberation-scripts/021-Scymillion";
      const user = {
        email: userEmail,
        nickname: selectedGameName,
        sub: userSub,
      };
      const setConfirmedRoomCode = jest.fn();
      const setChosenPath = jest.fn();
      const setConfirmedGameName = jest.fn();
      const sedersStarted = [
        {
          created: 1585970508141,
          lib_id: "seder",
          room_code: selectedRoomCode,
          path: selectedPath,
          user_email: userEmail,
          timestamp: "2020-04-04T03:21:48.141Z",
          closed: true,
        },
        {
          created: 1585973347633,
          lib_id: "seder",
          room_code: "MLLLQA",
          path: "madliberation-scripts/006-Practice_Script",
          user_email: userEmail,
          timestamp: "2020-04-04T04:09:07.633Z",
        },
        {
          created: 1585963851389,
          lib_id: "seder",
          room_code: "SSSHER",
          path: selectedPath,
          user_email: userEmail,
          timestamp: "2020-04-04T01:30:51.389Z",
        },
        {
          created: 1585963851309,
          lib_id: "seder",
          room_code: "OTHGWL",
          path: "scripts/090-something",
          user_email: userEmail,
          timestamp: "2020-04-04T01:30:51.309Z",
          closed: true,
        },
      ];
      const sedersJoined = [
        {
          lib_id:
            "participant#vmfjfurallx43jfldNMFDLKnglikethefirst64charsofthehashofth00",
          room_code: "OTHGWL",
          user_email: userEmail,
          game_name: selectedGameName,
        },
        {
          lib_id:
            "participant#uruuururthewholehash34890fjalfds239ftheg4u398poda",
          room_code: "TYRXUR",
          user_email: userEmail,
          game_name: "custom ABC name",
        },
        {
          lib_id: "participant#123fweretlakehash34890fjalfds239ftheg4u398poda",
          room_code: selectedRoomCode,
          user_email: userEmail,
          game_name: selectedGameName,
        },
        {
          lib_id: "participant#Xur333thewholehash34890fjalfds239ftheg4u398poda",
          room_code: "SYRXUR",
          user_email: userEmail,
          game_name: "ABC custom XYR name",
        },
        {
          lib_id: "participant#bbbbb23fweretlakehash34890fjalfds239u398podz",
          room_code: "RNADNA",
          user_email: userEmail,
          game_name: selectedGameName,
        },
      ];
      const expectedRejoinInit = {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGameName,
          roomCode: selectedRoomCode,
          user: userSub,
        }),
      };
      global.fetch = jest.fn().mockImplementation((url, init) => {
        const postData =
          init && init.body && init.body.length && JSON.parse(init.body);
        if (
          url.pathname === "/prod/seders" ||
          url.pathname === "/seders-started"
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersStarted };
              }),
            });
          });
        }
        if (url.pathname === "/prod/seders-joined") {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersJoined };
              }),
            });
          });
        }
        if (
          url.pathname === "/prod/rejoin" &&
          postData &&
          postData.roomCode &&
          postData.roomCode === selectedRoomCode &&
          postData.gameName &&
          postData.gameName === selectedGameName
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return {
                  gameName: selectedGameName,
                  roomCode: selectedRoomCode,
                  result: "success",
                };
              }),
            });
          });
        }
        return new Promise((resolve, reject) => {
          reject({ err: "bad fetch" });
        });
      });
      const history = { push: jest.fn() };
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <SedersPage
              history={history}
              user={user}
              setConfirmedRoomCode={setConfirmedRoomCode}
              setChosenPath={setChosenPath}
              setConfirmedGameName={setConfirmedGameName}
            ></SedersPage>
          </MemoryRouter>
        );
      });
      expect(global.fetch).toHaveBeenCalled();
      wrapper.update();
      expect(wrapper.findWhere((n) => n.is(Button)).exists()).toBe(true);
      selectSederByRoomCode(wrapper, selectedRoomCode);
      wrapper.update();
      await act(async () => {
        const button = wrapper.findWhere(
          (n) => n.is(Button) && n.is("#resume-this-seder-button")
        );
        await button.prop("onClick")();
      });
      wrapper.update();
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith(selectedRoomCode);
      expect(setChosenPath).toHaveBeenCalled();
      expect(setChosenPath).toHaveBeenCalledWith(selectedPath);
      expect(setConfirmedGameName).toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalledTimes(1);
      expect(setConfirmedGameName).toHaveBeenCalledWith(selectedGameName);
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/let-them-press-buttons");
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch.mock.calls[2][0].pathname).toEqual("/prod/rejoin");
      expect(global.fetch.mock.calls[2][1]).toEqual(expectedRejoinInit);
    });
  });
  describe("Re-join Case 5: seder closed, follower, assignments not populated", () => {
    // actually, for a follower, we don't know from the front end whether the
    // seder is closed, so this is identical to Case 3 (route to /you-have-joined)
    test("strict follower, never started a seder", async () => {
      const userEmail = "funfunny@yahoo.co";
      const selectedRoomCode = "FFUNNY";
      const selectedGameName = "Lapid Sprull";
      const userSub = "mr3mr3-case3-maybethereareother-cases";
      const selectedPath = "xxx-madliberation-scripts/010-Three_Script";
      const user = {
        email: userEmail,
        nickname: selectedGameName,
        sub: userSub,
      };
      const setConfirmedRoomCode = jest.fn();
      const setChosenPath = jest.fn();
      const setConfirmedGameName = jest.fn();
      const sedersStarted = [];
      const sedersJoined = [
        {
          lib_id:
            "participant#84849343tuallybesomethinglikethefirst64charsofthehashofth00",
          room_code: "MORXLY",
          user_email: userEmail,
          game_name: selectedGameName,
        },
        {
          lib_id:
            "participant#uruuururthewholehash34890fjalfds239ftheg4u398poda",
          room_code: "SYRXUR",
          user_email: userEmail,
          game_name: "custom XYR name",
        },
        {
          lib_id: "participant#123fweretlakehash34890fjalfds239ftheg4u398poda",
          room_code: selectedRoomCode,
          user_email: userEmail,
          game_name: selectedGameName,
        },
      ];
      const expectedRejoinInit = {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGameName,
          roomCode: selectedRoomCode,
          user: userSub,
        }),
      };
      global.fetch = jest.fn().mockImplementation((url, init) => {
        const postData =
          init && init.body && init.body.length && JSON.parse(init.body);
        if (
          url.pathname === "/prod/seders" ||
          url.pathname === "/seders-started"
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersStarted };
              }),
            });
          });
        }
        if (url.pathname === "/prod/seders-joined") {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersJoined };
              }),
            });
          });
        }
        if (
          url.pathname === "/prod/rejoin" &&
          postData &&
          postData.roomCode &&
          postData.roomCode === selectedRoomCode &&
          postData.gameName &&
          postData.gameName === selectedGameName
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return {
                  gameName: selectedGameName,
                  roomCode: selectedRoomCode,
                  result: "success",
                };
              }),
            });
          });
        }
        return new Promise((resolve, reject) => {
          reject({ err: "bad fetch" });
        });
      });
      const history = { push: jest.fn() };
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <SedersPage
              history={history}
              user={user}
              setConfirmedRoomCode={setConfirmedRoomCode}
              setChosenPath={setChosenPath}
              setConfirmedGameName={setConfirmedGameName}
            ></SedersPage>
          </MemoryRouter>
        );
      });
      expect(global.fetch).toHaveBeenCalled();
      wrapper.update();
      expect(wrapper.findWhere((n) => n.is(Button)).exists()).toBe(true);
      selectSederByRoomCode(wrapper, selectedRoomCode);
      wrapper.update();
      await act(async () => {
        const button = wrapper.findWhere(
          (n) => n.is(Button) && n.is("#resume-this-seder-button")
        );
        await button.prop("onClick")();
      });
      wrapper.update();
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith(selectedRoomCode);
      expect(setChosenPath).not.toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalledTimes(1);
      expect(setConfirmedGameName).toHaveBeenCalledWith(selectedGameName);
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/you-have-joined");
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch.mock.calls[2][0].pathname).toEqual("/prod/rejoin");
      expect(global.fetch.mock.calls[2][1]).toEqual(expectedRejoinInit);
    });
  });
  describe("Re-join Case 6: closed, assignments populated, but not answers", () => {
    // for closed seders WITH ASSIGNMENTS POPULATED it doesn't matter who started it
    // get a game name cookie, restore state, and send them to /play
    test("multiple overlaps", async () => {
      const userEmail = "multiple_overlaps@ab.cz";
      const selectedRoomCode = "DUNLOP";
      const selectedGameName = "Sply";
      const userSub = "abx778-case4-treeof-treeof-4";
      const selectedPath = "66-madliberation-scripts/021-Scymillion";
      const assignments = [
        {
          id: 1,
          defaultAnswer: "hi",
          prompt: "some prompt",
          sentence: "I am __.",
        },
        {
          id: 3,
          defaultAnswer: "hi3",
          prompt: "some 3 prompt",
          sentence: "I am 3__3.",
        },
      ];
      const user = {
        email: userEmail,
        nickname: selectedGameName,
        sub: userSub,
      };
      const setConfirmedRoomCode = jest.fn();
      const setChosenPath = jest.fn();
      const setConfirmedGameName = jest.fn();
      const sedersStarted = [
        {
          created: 1585973347633,
          lib_id: "seder",
          room_code: "MLLLQA",
          path: "madliberation-scripts/006-Practice_Script",
          user_email: userEmail,
          timestamp: "2020-04-04T04:09:07.633Z",
        },
        {
          created: 1585970508141,
          lib_id: "seder",
          room_code: selectedRoomCode,
          path: selectedPath,
          user_email: userEmail,
          timestamp: "2020-04-04T03:21:48.141Z",
          closed: true,
        },
        {
          created: 1585963851389,
          lib_id: "seder",
          room_code: "SSSHER",
          path: selectedPath,
          user_email: userEmail,
          timestamp: "2020-04-04T01:30:51.389Z",
        },
        {
          created: 1585963851309,
          lib_id: "seder",
          room_code: "OTHGWL",
          path: "scripts/090-something",
          user_email: userEmail,
          timestamp: "2020-04-04T01:30:51.309Z",
          closed: true,
        },
      ];
      const sedersJoined = [
        {
          lib_id:
            "participant#vmfjfurallx43jfldNMFDLKnglikethefirst64charsofthehashofth00",
          room_code: "OTHGWL",
          user_email: userEmail,
          game_name: selectedGameName,
        },
        {
          lib_id:
            "participant#uruuururthewholehash34890fjalfds239ftheg4u398poda",
          room_code: "TYRXUR",
          user_email: userEmail,
          game_name: "custom ABC name",
        },
        {
          lib_id: "participant#123fweretlakehash34890fjalfds239ftheg4u398poda",
          room_code: selectedRoomCode,
          user_email: userEmail,
          game_name: selectedGameName,
          assignments,
        },
        {
          lib_id: "participant#Xur333thewholehash34890fjalfds239ftheg4u398poda",
          room_code: "SYRXUR",
          user_email: userEmail,
          game_name: "ABC custom XYR name",
        },
        {
          lib_id: "participant#bbbbb23fweretlakehash34890fjalfds239u398podz",
          room_code: "RNADNA",
          user_email: userEmail,
          game_name: selectedGameName,
        },
      ];
      const expectedRejoinInit = {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGameName,
          roomCode: selectedRoomCode,
          user: userSub,
        }),
      };
      global.fetch = jest.fn().mockImplementation((url, init) => {
        const postData =
          init && init.body && init.body.length && JSON.parse(init.body);
        if (
          url.pathname === "/prod/seders" ||
          url.pathname === "/seders-started"
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersStarted };
              }),
            });
          });
        }
        if (url.pathname === "/prod/seders-joined") {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersJoined };
              }),
            });
          });
        }
        if (
          url.pathname === "/prod/rejoin" &&
          postData &&
          postData.roomCode &&
          postData.roomCode === selectedRoomCode &&
          postData.gameName &&
          postData.gameName === selectedGameName
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return {
                  gameName: selectedGameName,
                  roomCode: selectedRoomCode,
                  result: "success",
                };
              }),
            });
          });
        }
        return new Promise((resolve, reject) => {
          reject({ err: "bad fetch" });
        });
      });
      const history = { push: jest.fn() };
      const setAssignmentsData = jest.fn();
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <SedersPage
              history={history}
              user={user}
              setConfirmedRoomCode={setConfirmedRoomCode}
              setChosenPath={setChosenPath}
              setConfirmedGameName={setConfirmedGameName}
              setAssignmentsData={setAssignmentsData}
            ></SedersPage>
          </MemoryRouter>
        );
      });
      expect(global.fetch).toHaveBeenCalled();
      wrapper.update();
      expect(wrapper.findWhere((n) => n.is(Button)).exists()).toBe(true);
      selectSederByRoomCode(wrapper, selectedRoomCode);
      wrapper.update();
      await act(async () => {
        const button = wrapper.findWhere(
          (n) => n.is(Button) && n.is("#resume-this-seder-button")
        );
        await button.prop("onClick")();
      });
      wrapper.update();
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith(selectedRoomCode);
      expect(setChosenPath).toHaveBeenCalled();
      expect(setChosenPath).toHaveBeenCalledWith(selectedPath);
      expect(setConfirmedGameName).toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalledTimes(1);
      expect(setConfirmedGameName).toHaveBeenCalledWith(selectedGameName);
      expect(setAssignmentsData).toHaveBeenCalled();
      expect(setAssignmentsData).toHaveBeenCalledTimes(1);
      expect(setAssignmentsData).toHaveBeenCalledWith(assignments);
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/play");
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch.mock.calls[2][0].pathname).toEqual("/prod/rejoin");
      expect(global.fetch.mock.calls[2][1]).toEqual(expectedRejoinInit);
    });
  });
  describe("Re-join Case 7: closed, assignments and answers populated", () => {
    // this should allow the user to fetch the script long after the seder
    // get a game name cookie, restore state, and send them to /read-roster,
    // or maybe /submitted
    test("one overlap, follower", async () => {
      const userEmail = "multiple_overlaps@alberta.ca";
      const selectedRoomCode = "DUNLOP";
      const selectedGameName = "Sply";
      const userSub = "abx778-case4-treeof-treeof-4";
      const selectedPath = "66-madliberation-scripts/021-Scymillion";
      const assignments = [
        {
          id: 1,
          defaultAnswer: "hi",
          prompt: "some prompt",
          sentence: "I am __.",
        },
        {
          id: 3,
          defaultAnswer: "hi3",
          prompt: "some 3 prompt",
          sentence: "I am 3__3.",
        },
      ];
      const answers = [
        { answer: "xx", id: 1 },
        { answer: "yy", id: 3 },
      ];
      const user = {
        email: userEmail,
        nickname: selectedGameName,
        sub: userSub,
      };
      const setConfirmedRoomCode = jest.fn();
      const setChosenPath = jest.fn();
      const setConfirmedGameName = jest.fn();
      const sedersStarted = [
        {
          created: 1585973347633,
          lib_id: "seder",
          room_code: "MLLLQA",
          path: "madliberation-scripts/006-Practice_Script",
          user_email: userEmail,
          timestamp: "2020-04-04T04:09:07.633Z",
        },
        {
          created: 1585970508141,
          lib_id: "seder",
          room_code: "NONLDR",
          path: selectedPath,
          user_email: userEmail,
          timestamp: "2020-04-04T03:21:48.141Z",
          closed: true,
        },
        {
          created: 1585963851389,
          lib_id: "seder",
          room_code: "SSSHER",
          path: selectedPath,
          user_email: userEmail,
          timestamp: "2020-04-04T01:30:51.389Z",
        },
        {
          created: 1585963851309,
          lib_id: "seder",
          room_code: "OTHGWL",
          path: "scripts/090-something",
          user_email: userEmail,
          timestamp: "2020-04-04T01:30:51.309Z",
          closed: true,
        },
      ];
      const sedersJoined = [
        {
          lib_id:
            "participant#vmfjfurallx43jfldNMFDLKnglikethefirst64charsofthehashofth00",
          room_code: "OTHGWL",
          user_email: userEmail,
          game_name: selectedGameName,
        },
        {
          lib_id:
            "participant#uruuururthewholehash34890fjalfds239ftheg4u398poda",
          room_code: "TYRXUR",
          user_email: userEmail,
          game_name: "custom ABC name",
        },
        {
          lib_id: "participant#123fweretlakehash34890fjalfds239ftheg4u398poda",
          room_code: selectedRoomCode,
          user_email: userEmail,
          game_name: selectedGameName,
          assignments,
          answers,
        },
        {
          lib_id: "participant#Xur333thewholehash34890fjalfds239ftheg4u398poda",
          room_code: "SYRXUR",
          user_email: userEmail,
          game_name: "ABC custom XYR name",
        },
        {
          lib_id: "participant#bbbbb23fweretlakehash34890fjalfds239u398podz",
          room_code: "RNADNA",
          user_email: userEmail,
          game_name: selectedGameName,
        },
      ];
      const expectedRejoinInit = {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGameName,
          roomCode: selectedRoomCode,
          user: userSub,
        }),
      };
      global.fetch = jest.fn().mockImplementation((url, init) => {
        const postData =
          init && init.body && init.body.length && JSON.parse(init.body);
        if (url.pathname === "/seders" || url.pathname === "/seders-started") {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersStarted };
              }),
            });
          });
        }
        if (url.pathname === "/prod/seders-joined") {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return { Items: sedersJoined };
              }),
            });
          });
        }
        if (
          url.pathname === "/prod/rejoin" &&
          postData &&
          postData.roomCode &&
          postData.roomCode === selectedRoomCode &&
          postData.gameName &&
          postData.gameName === selectedGameName
        ) {
          return new Promise((resolve, reject) => {
            resolve({
              json: jest.fn().mockImplementation(() => {
                return {
                  gameName: selectedGameName,
                  roomCode: selectedRoomCode,
                  result: "success",
                };
              }),
            });
          });
        }
        return new Promise((resolve, reject) => {
          reject({ err: "bad fetch" });
        });
      });
      const history = { push: jest.fn() };
      const setAssignmentsData = jest.fn();
      let wrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <SedersPage
              history={history}
              user={user}
              setConfirmedRoomCode={setConfirmedRoomCode}
              setChosenPath={setChosenPath}
              setConfirmedGameName={setConfirmedGameName}
              setAssignmentsData={setAssignmentsData}
            ></SedersPage>
          </MemoryRouter>
        );
      });
      expect(global.fetch).toHaveBeenCalled();
      wrapper.update();
      expect(wrapper.findWhere((n) => n.is(Button)).exists()).toBe(true);
      selectSederByRoomCode(wrapper, selectedRoomCode);
      wrapper.update();
      await act(async () => {
        const button = wrapper.findWhere(
          (n) => n.is(Button) && n.is("#resume-this-seder-button")
        );
        await button.prop("onClick")();
      });
      wrapper.update();
      expect(setConfirmedRoomCode).toHaveBeenCalled();
      expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
      expect(setConfirmedRoomCode).toHaveBeenCalledWith(selectedRoomCode);
      expect(setChosenPath).not.toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalled();
      expect(setConfirmedGameName).toHaveBeenCalledTimes(1);
      expect(setConfirmedGameName).toHaveBeenCalledWith(selectedGameName);
      expect(setAssignmentsData).toHaveBeenCalled();
      expect(setAssignmentsData).toHaveBeenCalledTimes(1);
      expect(setAssignmentsData).toHaveBeenCalledWith(assignments);
      expect(history.push).toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/submitted");
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch.mock.calls[2][0].pathname).toEqual("/prod/rejoin");
      expect(global.fetch.mock.calls[2][1]).toEqual(expectedRejoinInit);
    });
    test("multiple game names used for the same seder under one email", () => {
      // This is allowed. Two people could be on the same device, or sharing a
      // login so that a person without a login (for some reason) can have their
      // work saved.
    });
  });
  test("Re-join button should be disabled until a selection is made", async () => {
    const user = {
      email: "user1@gmail.com",
      nickname: "Mister One",
      sub: "11-aa-m1-gha-one",
    };
    const setConfirmedRoomCode = jest.fn();
    const setChosenPath = jest.fn();

    const sedersStarted = [
      {
        created: 1585970508141,
        lib_id: "seder",
        room_code: "IJYAQX",
        path: "madliberation-scripts/005-Practice_Script",
        user_email: "user1@gmail.com",
        timestamp: "2020-04-04T03:21:48.141Z",
      },
      {
        created: 1585973347633,
        lib_id: "seder",
        room_code: "ZLSXQA",
        path: "madliberation-scripts/006-Practice_Script",
        user_email: "user1@gmail.com",
        timestamp: "2020-04-04T04:09:07.633Z",
      },
      {
        created: 1585963851309,
        lib_id: "seder",
        room_code: "GMKMNB",
        path: "madliberation-scripts/007-Practice_Script",
        user_email: "user1@gmail.com",
        timestamp: "2020-04-04T01:30:51.309Z",
      },
    ];
    const sedersJoined = [];
    global.fetch = jest.fn().mockImplementation((url, init) => {
      if (
        url.pathname === "/prod/seders" ||
        url.pathname === "/seders-started"
      ) {
        return new Promise((resolve, reject) => {
          resolve({
            json: jest.fn().mockImplementation(() => {
              return { Items: sedersStarted };
            }),
          });
        });
      }
      if (url.pathname === "/prod/seders-joined") {
        return new Promise((resolve, reject) => {
          resolve({
            json: jest.fn().mockImplementation(() => {
              return { Items: sedersJoined };
            }),
          });
        });
      }
    });
    const history = { push: jest.fn() };
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <SedersPage
            history={history}
            user={user}
            setConfirmedRoomCode={setConfirmedRoomCode}
            setChosenPath={setChosenPath}
          ></SedersPage>
        </MemoryRouter>
      );
    });
    expect(global.fetch).toHaveBeenCalled();
    wrapper.update();
    expect(wrapper.findWhere((n) => n.is(Button)).exists()).toBe(true);
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.is(Button) &&
            n.prop("disabled") &&
            n.is("#resume-this-seder-button")
        )
        .exists()
    ).toBe(true);
    selectSederByRoomCode(wrapper, "ZLSXQA");
    wrapper.update();
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.is(Button) &&
            !n.prop("disabled") &&
            n.is("#resume-this-seder-button")
        )
        .exists()
    ).toBe(true);
    act(() => {
      const button = wrapper.findWhere(
        (n) => n.is(Button) && n.is("#resume-this-seder-button")
      );
      button.prop("onClick")();
    });
    expect(setConfirmedRoomCode).toHaveBeenCalled();
    expect(setConfirmedRoomCode).toHaveBeenCalledTimes(1);
    expect(setConfirmedRoomCode).toHaveBeenCalledWith("ZLSXQA");
    expect(setChosenPath).toHaveBeenCalled();
    expect(setChosenPath).toHaveBeenCalledTimes(1);
    expect(setChosenPath).toHaveBeenCalledWith(
      "madliberation-scripts/006-Practice_Script"
    );
    expect(history.push).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalledWith("/your-room-code");
  });
  describe("Failed fetches", () => {
    test("failed fetch to /seders-started should show an error message", () => {});
    test("failed fetch to /seders-joined should show an error message", () => {});
    test("failed fetch to /rejoin should show an error message", () => {});
  });
});
