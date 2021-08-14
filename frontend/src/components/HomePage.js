import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import RedSeaImage from "../background-red-sea.jpg";
import MadLiberationLogo from "../mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../VAPLogo-white.png";
import { Configs } from "../Configs";
import { madLiberationStyles } from "../madLiberationStyles";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";

const styles = () => {
  return {
    ...madLiberationStyles,
    homePageBackground: {
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
    madliberationLogo: {
      height: "200px",
    },
    veryAwesomePassoverLogo: {
      height: "70px",
    },
    loginLink: {
      textDecoration: "none",
      color: "black",
    },
  };
};

class HomePage extends Component {
  render() {
    const { classes, user, setUser, storage } = this.props;

    return (
      <div className={classes.homePageBackground}>
        <div>
          <div>
            <img
              alt="Mad Liberation: Let My People LOL"
              src={MadLiberationLogo}
              className={classes.madliberationLogo}
            />
          </div>
          <div>
            <Button
              madliberationid="join-a-seder-button"
              title="Join a seder"
              variant="contained"
              component={Link}
              color="primary"
              to="/enter-room-code"
            >
              Join a seder
            </Button>
          </div>
          <div>
            <br />
            <Button
              madliberationid="lead-a-seder-by-video-button"
              title="Lead a seder - by video"
              variant="contained"
              component={Link}
              to="/explain-video"
            >
              Lead a seder - by video
            </Button>
          </div>
          <br />
          {!user && (
            <div id="login-container">
              <a href={Configs.loginUrl()} className={classes.loginLink}>
                <Button
                  madliberationid="login-button"
                  title="Log in"
                  variant="contained"
                >
                  Log in
                </Button>
              </a>
            </div>
          )}
          <br />

          {user && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
                id="logout-container"
              >
                <br />
                <Paper style={{ padding: "8px" }}>
                  <Typography component="p">
                    Logged in as {user.nickname}
                  </Typography>
                  <div>
                    <Typography component="p">
                      <Button
                        component={Link}
                        to="/seders"
                        title="see-your-seders-button"
                        madliberationid="see-your-seders-button"
                      >
                        See your seders
                      </Button>
                    </Typography>
                  </div>
                  <div>
                    <Typography component="p">
                      <Button
                        onClick={() => {
                          setUser(false);
                          storage.removeItem("user-nickname");
                          storage.removeItem("user-email");
                          storage.removeItem("user-sub");
                        }}
                        madliberationid="logout-button"
                      >
                        Log out
                      </Button>
                    </Typography>
                  </div>
                </Paper>
              </div>
            </>
          )}
          <br />
          <br />
          <img
            alt="Very Awesome Passover"
            src={VeryAwesomePassoverLogo}
            className={classes.veryAwesomePassoverLogo}
          />
          <br />
          <br />
          <div>
            <Typography component="p">
              <a href="#/about">About</a>
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  storage: PropTypes.shape({ removeItem: PropTypes.func }).isRequired,
};

export default withStyles(styles)(HomePage);
