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

const steps = [
  {
    order: 1,
    label: "Pick script",
    body: <div></div>,
  },
  {
    order: 2,
    label: "Your email",
    body: <div></div>,
  },
].sort((a: any, b: any) => {
  if (a.order === b.order) return 0;
  if (a.order < b.order) return -1;
  return a;
});

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

export default function Home() {
  const [accordionExpanded, setAccordionExpanded] = React.useState(
    steps.map(() => {
      return false;
    })
  );

  return (
    <div
      style={{
        backgroundColor: "#81181f",
        height: "100%",
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
        </Paper>
      </Container>
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
