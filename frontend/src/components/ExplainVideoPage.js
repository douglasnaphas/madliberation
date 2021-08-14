import React, { Component } from "react";
import { Link } from "react-router-dom";
import MenuAppBar from "./MenuAppBar";
import { Button } from "@material-ui/core";
import { madLiberationStyles } from "../madLiberationStyles";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import StageDirection from "./StageDirection";

const styles = () => {
  return {
    bordered: {
      paddingRight: "20px",
      paddingLeft: "20px",
      paddingTop: "10px",
      paddingBottom: "10px",
    },
  };
};

class ExplainVideoPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div madliberationid="explain-page">
        <MenuAppBar />
        <div>
          <br />
          <div className={classes.bordered}>
            <Typography variant="h1" component="h2" gutterBottom>
              Order! Order! Order!
            </Typography>
            <Typography component="p" paragraph>
              Dear Leader (of this virtual seder), follow these instructions to
              bring order to your remote seder.
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom>
              Get everyone's attention and explain the first step
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>Read aloud</StageDirection>: Happy Passover! We
              are about to play a game called Mad Liberation, so I am going to
              explain how to play. Before I proceed, make sure you have access
              to either your smartphone or a web browser on your computer. The
              computer works just as well as the phone. Please let me know if
              you do NOT have a device ready at this time.
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom>
              Explain the concept
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>Read aloud</StageDirection>: Together, we’re going
              to create a fill-in-the-blank Haggadah by answering prompts on our
              phones or computers with words or phrases. We’ll then take turns
              reading our one-of-a-kind creation.
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>
                Pause for questions. Once all are answered, move on.
              </StageDirection>
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom>
              Figure out the order of readers
            </Typography>
            <Typography component="p" paragraph>
              Somehow. Just figure out what order people will read the script in
              and make note of it. The app still works if people read out of
              order.
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom>
              Provide further instructions
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>Read aloud</StageDirection>: On your phone or
              computer, type{" "}
              <span style={madLiberationStyles.blue}>
                {window.location.host}
              </span>{" "}
              in a web browser. When you’re there, clicking <b>Log in</b> is
              optional, but it will let you re-join the seder if anything goes
              wrong. Either way, whether you log in, or not, click{" "}
              <b>Join a Seder</b>. If you aren't able to join the seder on your
              device, try using a different browser. Go ahead, I’ll wait.
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>
                Pause and confirm that everyone has complied.
              </StageDirection>
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>Read aloud</StageDirection>: I’ll give you the
              Room Code to enter the seder in a few moments. For now, keep
              listening to me talk. When you get your prompts, pay attention to
              how you phrase your answers. Make sure you fill in and click
              through all of your prompts, then hit "Submit” when you’re done.
              After we've all submitted, click "Yes, I want the script.” Then,
              we read our collective creation! The app will tell us when it’s
              time to “pass” to the next reader. Any questions?
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>
                Pause for questions. Once all are answered, move on.
              </StageDirection>
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom>
              Provide additional clarity...and don't close your tabs!
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>Read aloud</StageDirection>: One more thing:{" "}
              <b>
                Once you've joined the seder, don't close the tab or go to any
                other web sites in the tab in which you have the game open.
              </b>{" "}
              If you click Log In on the Home Page before you join our seder,
              and you accidentally close your tab, you can probably re-join by
              logging in again and clicking <b>See your seders</b>. Logging in
              also lets you retrieve the completed script later.
            </Typography>
            <Typography component="p" paragraph>
              If you encounter any problems, try using a different browser or
              device.
            </Typography>
            <Typography component="p" paragraph>
              If everyone is ready to celebrate Passover, I'm going to click
              "Proceed" to generate our Room Code and let the Mad Liberation
              begin!
            </Typography>
          </div>
          <div>
            <Button
              madliberationid="proceed-from-explanation-button"
              variant="contained"
              color="primary"
              component={Link}
              to="/pick-script"
            >
              Proceed
            </Button>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ExplainVideoPage);
