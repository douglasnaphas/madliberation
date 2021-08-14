import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Radio from "@material-ui/core/Radio";
import { Button, CircularProgress } from "@material-ui/core";
import MenuAppBar from "./MenuAppBar";
import { Configs } from "../Configs";
import { Typography } from "@material-ui/core";

function SedersPage({
  history,
  user,
  setConfirmedRoomCode,
  setChosenPath,
  setConfirmedGameName,
  setAssignmentsData,
}) {
  const [sedersIStarted, setSedersIStarted] = useState([]);
  const [sedersIJoined, setSedersIJoined] = useState([]);
  const [selectedRoomCode, setSelectedRoomCode] = useState();
  const [selectionMade, setSelectionMade] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  useEffect(() => {
    if (!user || !user.sub) return;
    const sedersStartedUrl = new URL(
      `./seders?user=${user.sub}`,
      Configs.apiUrl()
    );
    fetch(sedersStartedUrl, {
      credentials: "include",
    })
      .then((r) => {
        return r.json();
      })
      .then((s) => {
        if (s.Items && Array.isArray(s.Items)) {
          setSedersIStarted(s.Items);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    const sedersJoinedUrl = new URL(
      `./seders-joined?user=${user.sub}`,
      Configs.apiUrl()
    );
    fetch(sedersJoinedUrl, {
      credentials: "include",
    })
      .then((r) => {
        return r.json();
      })
      .then((s) => {
        if (s.Items && Array.isArray(s.Items)) {
          setSedersIJoined(s.Items);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);
  const seders = new Map();
  sedersIStarted.forEach((seder) => {
    const {
      room_code,
      created,
      lib_id,
      path,
      user_email,
      timestamp,
      closed,
    } = seder;
    if (room_code) {
      seders.set(seder.room_code, {
        created,
        lib_id,
        path,
        user_email,
        timestamp,
        closed,
      });
    }
  });
  sedersIJoined.forEach((seder) => {
    const {
      lib_id,
      room_code,
      user_email,
      game_name,
      assignments,
      answers,
    } = seder;
    if (room_code) {
      seders.set(room_code, {
        ...seders.get(room_code),
        game_name,
        assignments,
        answers,
      });
    }
  });
  const sederTable = (
    <Table>
      <TableBody>
        {Array.from(seders).map((s) => {
          const roomCode = s[0];
          return (
            <TableRow key={roomCode}>
              <TableCell>
                <Radio
                  id={`radio-${roomCode}`}
                  madliberationid={`radio-${roomCode}`}
                  checked={selectedRoomCode === roomCode}
                  value={roomCode}
                  onChange={(event) => {
                    setSelectedRoomCode(event.target.value);
                    setSelectionMade(true);
                  }}
                ></Radio>
              </TableCell>
              <TableCell>{roomCode}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
  const buttonProps = {
    id: "resume-this-seder-button",
    madliberationid: "resume-this-seder-button",
    variant: "contained",
    disabled: !selectionMade || buttonClicked,
  };

  // if (!seders || !seders.size) return <CircularProgress></CircularProgress>;

  return (
    <>
      <MenuAppBar></MenuAppBar>
      <br></br>
      <br></br>
      <div>
        <br />
        <Typography variant="h4" gutterBottom>
          You are or were in seders with these Room Codes:
        </Typography>
      </div>
      {seders.size ? (
        <>
          <div>{sederTable}</div>
          <div>
            <br />
            {}
            <Button
              {...buttonProps}
              onClick={async (e) => {
                setButtonClicked(true);
                let buttonTarget = "/your-room-code";
                setConfirmedRoomCode(selectedRoomCode);
                const selectedGameName =
                  selectedRoomCode &&
                  seders &&
                  seders.get &&
                  seders.get(selectedRoomCode) &&
                  seders.get(selectedRoomCode).game_name;
                const seder = seders.get(selectedRoomCode);
                if (seder.path) {
                  setChosenPath(seder.path);
                }
                if (seder.assignments) {
                  setAssignmentsData(seder.assignments);
                }
                if (!selectedGameName && !seder.closed) {
                  history.push(buttonTarget);
                  return;
                }
                setConfirmedGameName(selectedGameName);
                const fetchInit = {
                  credentials: "include",
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    gameName: selectedGameName,
                    roomCode: selectedRoomCode,
                    user: user.sub,
                  }),
                };
                await fetch(new URL("./rejoin", Configs.apiUrl()), fetchInit);
                if (seder.path && !seder.closed) {
                  // this is the seder leader
                  buttonTarget = "/roster";
                  history.push(buttonTarget);
                  return;
                }
                if (seder.path && seder.closed && !seder.assignments) {
                  // leader
                  buttonTarget = "/let-them-press-buttons";
                  history.push(buttonTarget);
                  return;
                }
                if (!seder.path && !seder.assignments) {
                  // follower
                  buttonTarget = "/you-have-joined";
                  history.push(buttonTarget);
                  return;
                }
                if (seder.assignments && !seder.answers) {
                  buttonTarget = "/play";
                  history.push(buttonTarget);
                  return;
                }
                buttonTarget = "/submitted";
                history.push(buttonTarget);
                setButtonClicked(false);
              }}
            >
              Resume seder
            </Button>
          </div>
        </>
      ) : (
        <div>
          <CircularProgress />
        </div>
      )}
    </>
  );
}
export default SedersPage;
