import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});

const About2 = () => {
  const { param1 } = useParams();
  console.log(`param1: ${param1}`);
  return (
    <div>
      <MenuAppBar />
      <div madliberationid="about-page">
        <br />
        <Typography variant="h2" gutterBottom>
          About
        </Typography>
        <Typography component="p" paragraph gutterBottom>
          Mad Liberation is a game of mad lib haggadahs.
        </Typography>
        <Typography component="p" paragraph gutterBottom>
          That means that you use it to read a script for the Jewish holiday
          Passover, with blanks filled in by you and your friends.
        </Typography>
        <Typography id="about-text" component="p" paragraph gutterBottom>
          Try it out and let us know what you think. Feel free to raise an issue
          on{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/douglasnaphas/madliberation/issues"
          >
            GitHub
          </a>{" "}
          (opens in a new tab) for any bugs encountered or features desired.
        </Typography>
        <Typography component="p" paragraph gutterBottom>
          param1={`${param1}`}
          param2={`${param2}`}
        </Typography>
      </div>
    </div>
  );
};

export default withStyles(styles)(About2);
