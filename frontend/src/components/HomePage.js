/** @jsxImportSource @emotion/react */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Global, css } from "@emotion/react";
import RedSeaImage from "../background-red-sea.jpg";
import MadLiberationLogo from "../mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../VAPLogo-white.png";
import { Configs } from "../Configs";
import { madLiberationStyles } from "../madLiberationStyles";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";

const styles = {
  ...madLiberationStyles,
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
  ".loginLink": {
    textDecoration: "none",
    color: "black",
  },
};

class HomePage extends Component {
  state = { logoutClicked: false };
  render() {
    const { user, setUser, storage } = this.props;
    const createHaggadahLinkText =
      "Plan a seder where people fill out their mad libs beforehand (experimental)";
    const createHaggadahLink = () => 
      <a target="_blank" href={`/create-haggadah/index.html`}>
        {createHaggadahLinkText}
      </a>;
    return (
      <div>
        <div>
          <Global styles={styles} />
        </div>
        <div className="homePageBackground">
          <div>
            <div>
              <img
                alt="Mad Liberation: Let My People LOL"
                src={MadLiberationLogo}
                className="madliberationLogo"
              />
            </div>
            <div>
              <Button
                madliberationid="plan-seder-button"
                title={createHaggadahLinkText}
                variant="contained"
                component={createHaggadahLink}
                color="secondary"
                to="/create-haggadah/index.html"
              >
                Join a seder
              </Button>
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
                madliberationid="lead-a-seder-in-person-button"
                title="Lead a seder - in person"
                variant="contained"
                component={Link}
                color="secondary"
                to="/explain"
              >
                Lead a seder - in person
              </Button>
            </div>
            <div>
              <br />
              <Button
                madliberationid="lead-a-seder-by-video-button"
                title="Lead a seder - by video"
                variant="contained"
                component={Link}
                color="secondary"
                to="/explain-video"
              >
                Lead a seder - by video
              </Button>
            </div>
            <br />
            {!user && (
              <div id="login-container">
                <a href={Configs.loginUrl()} className="loginLink">
                  <Button
                    madliberationid="login-button"
                    title="Log in"
                    variant="contained"
                    color="secondary"
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
                          disabled={this.state.logoutClicked}
                          onClick={() => {
                            this.setState({ logoutClicked: true });
                            fetch(Configs.apiRelativeUrl("logout"), {
                              credentials: "include",
                            }).then((r) => {
                              setUser(false);
                              storage.removeItem("user-nickname");
                              storage.removeItem("user-email");
                            });
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
              className="veryAwesomePassoverLogo"
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
      </div>
    );
  }
}

HomePage.propTypes = {
  storage: PropTypes.shape({ removeItem: PropTypes.func }).isRequired,
};

export default HomePage;
