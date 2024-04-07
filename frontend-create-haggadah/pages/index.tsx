/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Paper } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { madLiberationStyles } from "../madLiberationStyles";
import ScriptMenu from "../src/ScriptMenu";
import { fetchScripts } from "../src/fetchScripts";
import { getEditLink } from "../src/getEditLink";
import YourInfoSection from "../src/YourInfoSection";
import SubmitSection from "../src/SubmitSection";
import Head from "next/head";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));
  const [selectedScript, setSelectedScript] = React.useState("");
  const [yourEmail, setYourEmail] = React.useState("");
  const [yourName, setYourName] = React.useState("");
  const [editLink, setEditLink] = React.useState("");
  const [user_nickname, setUserNickname] = React.useState("");
  const [createHaggadahError, setCreateHaggadahError] = React.useState(false);
  React.useEffect(() => {
    fetch("../v2/user", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        console.log("j is", j);
        if (j.user_nickname) {
          setUserNickname(j.user_nickname);
        }
      });
  }, []);
  const steps = [
    {
      order: 1,
      label: "Pick script",
      body: (
        <div>
          <ScriptMenu
            disabled={editLink !== ""}
            fetchScripts={fetchScripts}
            selectedScript={selectedScript}
            setSelectedScript={setSelectedScript}
          ></ScriptMenu>
        </div>
      ),
    },
    {
      order: 2,
      label: "Your info",
      body: (
        <div>
          <YourInfoSection
            disabled={editLink !== ""}
            setYourEmail={setYourEmail}
            setYourName={setYourName}
          ></YourInfoSection>
        </div>
      ),
    },
  ].sort((a: any, b: any) => {
    if (a.order === b.order) return 0;
    if (a.order < b.order) return -1;
    return a;
  });
  const [accordionExpanded, setAccordionExpanded] = React.useState(
    steps.map(() => {
      return false;
    })
  );

  interface LoggedInAsSectionProps {
    user_nickname: string;
  }

  const LoggedInAsSection: React.FC<LoggedInAsSectionProps> = ({
    user_nickname,
  }) => {
    if (!user_nickname) {
      return <></>;
    }
    return (
      <Paper>
        <div id="logged-in-as-section">Logged in as {user_nickname}</div>
      </Paper>
    );
  };

  return (
    <div>
      <Head>
        <title>Plan a Seder</title>
      </Head>
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
          <LoggedInAsSection user_nickname={user_nickname}></LoggedInAsSection>
          <Paper>
            <div>
              {" "}
              {/* accordions from steps */}
              {steps.map((step, index) => {
                return (
                  <div>
                    <Accordion
                      expanded={accordionExpanded[index]}
                      onChange={(event) => {
                        setAccordionExpanded((oldAccordionExpanded) => {
                          return oldAccordionExpanded.map((a, i) => {
                            if (i === index) {
                              return !a;
                            }
                            return a;
                          });
                        });
                      }}
                    >
                      <AccordionSummary>{step.label}</AccordionSummary>
                      <AccordionDetails>{step.body}</AccordionDetails>
                    </Accordion>
                  </div>
                );
              })}
            </div>
            <div>
              {createHaggadahError ? (
                <Typography
                  component="p"
                  paragraph
                  gutterBottom
                  style={{ color: "red" }}
                >
                  Unable to create your Haggadah, sorry. Please try again in a
                  new tab or different browser.
                </Typography>
              ) : (
                <SubmitSection
                  getEditLink={getEditLink}
                  setEditLink={setEditLink}
                  leaderEmail={yourEmail}
                  leaderName={yourName}
                  path={selectedScript}
                  setCreateHaggadahError={setCreateHaggadahError}
                ></SubmitSection>
              )}
            </div>
          </Paper>
        </Container>

        <br />
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
    </div>
  );
}
