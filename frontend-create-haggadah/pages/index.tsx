/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../src/Link";
import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";
import RedSeaImage from "../public/background-red-sea.jpg";
import MadLiberationLogo from "../mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";

const styles = {
  ".homePageBackground": {
    backgroundImage: `url(${RedSeaImage})`,
    minHeight: "100%",
    width: "100%",
    height: "auto",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  ".madliberationLogo": {
    height: "200px",
  },
  ".veryAwesomePassoverLogo": {
    height: "70px",
  },
};

export default function Home() {
  return (
    <div>
      <div
        css={{
          backgroundColor: "hotpink",
          "&:hover": {
            color: "lightgreen",
          },
        }}
      >
        This has a hotpink background.
      </div>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            MUI v5 + Next.js with TypeScript example
          </Typography>
          <Link href="/about" color="secondary">
            Go to the about page
          </Link>
          <ProTip />
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}
