/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import {
  Card,
  CardActions,
  CardContent,
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
enum PageState {
  LOADING = 0,
  READY,
}
const PromptSection = (props: {
  answers: any;
  setAnswers: any;
  assignments: Array<Assignment>;
  selectedAssignmentIndex: number;
  setSelectedAssignmentIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {
    answers,
    setAnswers,
    assignments,
    selectedAssignmentIndex,
    setSelectedAssignmentIndex,
  } = props;
  if (assignments.length < 1) {
    return <div></div>;
  }
  const assignment = assignments[selectedAssignmentIndex];
  const answer = answers[`${assignment.id}`];
  return (
    <div>
      <div>
        <Typography component="p" paragraph gutterBottom>
          Enter a word or phrase to replace...
        </Typography>
      </div>
      <Card>
        <CardContent>
          <Container maxWidth="sm">
            <Paper elevation={3}>{assignment.prompt}</Paper>
          </Container>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </div>
  );
};
const ChipSection = (props: {
  setSelectedAssignmentIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedAssignmentIndex: number;
  assignments: Array<Assignment>;
  answers: any;
}) => {
  const {
    setSelectedAssignmentIndex,
    selectedAssignmentIndex,
    assignments,
    answers,
  } = props;
  return (
    <div style={{ padding: "8px" }}>
      {assignments.map((assignment, assignmentIndex) => {
        return (
          <Chip
            label={assignment.prompt}
            color={
              assignmentIndex === selectedAssignmentIndex
                ? "primary"
                : "default"
            }
            clickable={true}
            onClick={() => {
              setSelectedAssignmentIndex(assignmentIndex);
            }}
            size="small"
          ></Chip>
        );
      })}
    </div>
  );
};
export default function Blanks() {
  const [assignments, setAssignments] = React.useState<Array<Assignment>>([]);
  const [answers, setAnswers] = React.useState({});
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] =
    React.useState(0);
  let sederCode: any, pw: any, ph: any;
  if (typeof window !== "undefined" && typeof URLSearchParams === "function") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    sederCode = urlSearchParams.get("sederCode");
    pw = urlSearchParams.get("pw");
    ph = urlSearchParams.get("ph");
  }
  React.useEffect(() => {
    (async () => {
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
    })();
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
          <PromptSection
            answers={answers}
            setAnswers={setAnswers}
            assignments={assignments}
            selectedAssignmentIndex={selectedAssignmentIndex}
            setSelectedAssignmentIndex={setSelectedAssignmentIndex}
          ></PromptSection>
          <ChipSection
            setSelectedAssignmentIndex={setSelectedAssignmentIndex}
            selectedAssignmentIndex={selectedAssignmentIndex}
            assignments={assignments}
            answers={answers}
          ></ChipSection>
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
