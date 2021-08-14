import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MenuAppBar from './MenuAppBar';
import { Button } from '@material-ui/core';
import { madLiberationStyles } from '../madLiberationStyles';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core/styles';
import StageDirection from './StageDirection';
import Answer from './Answer';

const styles = () => {
  return {
    bordered: {
      paddingRight: '20px',
      paddingLeft: '20px',
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  };
};

class ExplainPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div madliberationid="explain-page">
        <MenuAppBar />
        <div>
          <br />
          <div className={classes.bordered}>
            <Typography component="p" paragraph>
              <StageDirection>
                Read this aloud to everyone at your seder to explain what's
                about to happen.
              </StageDirection>
            </Typography>
            <Typography component="p" paragraph>
              Everyone please listen to me.{' '}
              <StageDirection>
                You can clink a glass, if that helps.
              </StageDirection>
            </Typography>
            <Typography component="p" paragraph>
              Happy Passover! We are about to play a game called Mad Liberation,
              which is like a seder but fun, so I am going to explain how to
              play.
            </Typography>
            <Typography component="p" paragraph>
              Together, we’re going to create a fill-in-the-blank Haggadah by
              answering prompts on our phones with words or phrases. We’ll then
              take turns reading our one-of-a-kind creation from a single device
              that we'll pass around.
            </Typography>
            <Typography component="p" paragraph>
              First, I need all of you to get out your phones and type{' '}
              <span style={madLiberationStyles.blue}>passover.lol</span> in a
              web browser. When you’re there, click <b>Log in</b>, then{' '}
              <b>Join a Seder</b>. Logging in isn't mandatory, but it will let
              you re-join the seder if anything goes wrong. Go ahead, I’ll wait.
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>
                Wait for everyone to go to passover.lol and click “join a
                seder.”
              </StageDirection>
            </Typography>
            <Typography component="p" paragraph>
              I’ll give you the Room Code to enter when I get it in a few
              minutes. For now, keep listening to me talk.
            </Typography>
            <Typography component="p" paragraph>
              When you get your prompts, pay attention to how you phrase your
              answers. There will be examples to guide you, so our Haggadah
              doesn't wind up with something like, "Moses woke up the next day
              feeling extremely <Answer prompt="emotion">happiness</Answer>
              ."
            </Typography>
            <Typography component="p" paragraph>
              Make sure you fill in and click through all of your prompts, then
              hit "Submit” when you’re done.
            </Typography>
            <Typography component="p" paragraph>
              After we've all submitted, we'll be passing around and reading
              from a single device. I will choose a volunteer now.
            </Typography>
            <Typography component="p" paragraph>
              <StageDirection>
                Choose the person whose device you’ll use. You may choose
                yourself.
              </StageDirection>
            </Typography>
            <Typography component="p" paragraph>
              Great, thank you!
            </Typography>
            <Typography component="p" paragraph>
              When the time comes, you’ll click "Yes, I want the script" after
              you’ve finished all your prompts. Then, we read! The app will tell
              us when it’s time to pass.
            </Typography>
            <Typography component="p" paragraph>
              One more thing: this app is in gamma mode, which means it's still
              being tested out and improved. Keep these tips in mind:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
                <ListItemText>
                  <Typography>
                    If you aren't able to join the seder on your device, try
                    using a different browser.
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
                <ListItemText>
                  <Typography>
                    Once you've joined the seder, don't close the tab or go to
                    any other web sites in the tab that you have the game open
                    in. If you click Log In on the Home Page before you join our
                    seder, and you accidentally close your tab, you can probably
                    re-join by logging in again and clicking{' '}
                    <b>See your seders</b>, but that feature is experimental.
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
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

export default withStyles(styles)(ExplainPage);
