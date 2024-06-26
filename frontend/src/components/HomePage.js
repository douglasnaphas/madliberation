/** @jsxImportSource @emotion/react */
import React, { Component } from "react";
import { Button, Typography } from "@mui/material";
import { Global, css } from "@emotion/react";
import RedSeaImage from "../background-red-sea.jpg";
import MadLiberationLogo from "../mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../VAPLogo-white.png";
import { Configs } from "../Configs";
import { madLiberationStyles } from "../madLiberationStyles";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
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
    const createHaggadahLinkText = "Plan a seder";
    const createHaggadahHref = `/create-haggadah/index.html`;
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div id="site-description">
                <h1 style={{ fontSize: "16px", color: "white" }}>
                  Mad lib Haggadahs for your Passover Seder
                </h1>
              </div>
            </div>
            <br></br>
            <div
              id="home-page-main-content"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <Paper style={{ padding: "8px", maxWidth: "fit-content" }}>
                  <div id="plan-seder-button-section">
                    <div>
                      <Button
                        madliberationid="plan-seder-button"
                        variant="contained"
                        color="primary"
                        href={createHaggadahHref}
                        disabled={!user}
                      >
                        {createHaggadahLinkText}
                      </Button>
                    </div>
                    {!user && (
                      <div id="plan-seder-requires-login-explanation">
                        <em>Requires login</em>
                      </div>
                    )}
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
                        <div id="post-login-content">
                          <Typography component="p">
                            Logged in as {user.nickname}
                          </Typography>
                          <div>
                            <Typography component="p">
                              <Button
                                href="/create-haggadah/seders.html"
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
                        </div>{" "}
                      </div>
                    </>
                  )}
                  <div>
                    <Typography component="p">
                      <a href="#/about">About</a>
                    </Typography>
                  </div>
                </Paper>
              </div>
            </div>{" "}
            <br />
            <br />
            <img
              alt="Very Awesome Passover"
              src={VeryAwesomePassoverLogo}
              className="veryAwesomePassoverLogo"
            />
            <br />
            <br />
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
