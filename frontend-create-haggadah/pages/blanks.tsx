/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import {
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

interface Assignment {
  id: number;
  prompt: string;
  sentence?: string;
}
interface Answer {
  id: number;
  text: string;
}
export default function Blanks() {
  const [assignments, setAssignments] = React.useState<Array<Assignment>>([]);
  const [answers, setAnswers] = React.useState({});
  let sederCode: any, pw: any, ph: any;
  if (typeof window !== "undefined" && typeof URLSearchParams === "function") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    sederCode = urlSearchParams.get("sederCode");
    pw = urlSearchParams.get("pw");
    ph = urlSearchParams.get("ph");
  }
  React.useEffect(() => {
    if (sederCode && pw) {
      fetch(
        `../v2/assignments?sederCode=${sederCode}&pw=${pw}&roomcode=${sederCode}&ph=${ph}`
      )
        .then((r) => r.json())
        .then((j) => {
          setAssignments(j);
        });
      // we'll need to grab saved answers as well
      // maybe just grab them when an answer gets displayed
    }
  }, []);
  return (
    <div
      style={{
        backgroundColor: "#81181f",
        height: "100%",
        minHeight: "100%",
      }}
    >
      <div>
        <img
          css={{
            height: "200px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          src={`${MadLiberationLogo.src}`}
        ></img>
      </div>
      <Container maxWidth="md">
        <Paper>
          <div></div>
          <div style={{ padding: "8px" }}>
            {assignments.map((assignment) => {
              return <Chip label={assignment.prompt} size="small"></Chip>;
            })}
          </div>
        </Paper>
      </Container>
      <br></br>
      <img
        css={{
          height: "70px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        src={`${VeryAwesomePassoverLogo.src}`}
      ></img>
    </div>
  );
}
