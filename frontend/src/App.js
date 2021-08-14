import CssBaseline from "@material-ui/core/CssBaseline";
import React, { Component } from "react";
import { Route } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";

import About from "./components/About";
import "./App.css";
import { closeSeder } from "./lib/closeSeder";
import DoneNotReadingPage from "./components/DoneNotReadingPage";
import { getScriptsFromApi } from "./lib/getScriptsFromApi";
import HowToPlay from "./components/HowToPlay";
import LetThemPressButtonPage from "./components/LetThemPressButtonPage";
import HomePage from "./components/HomePage";
import { joinSeder } from "./lib/joinSeder";
import PickScriptPage from "./components/PickScriptPage";
import YourRoomCodePage from "./components/YourRoomCodePage";
import RosterPage from "./components/RosterPage";
import { roster } from "./lib/roster";
import PlayPage from "./components/PlayPage";
import { assignments } from "./lib/assignments";
import SubmittedPage from "./components/SubmittedPage";
import { submitLibs } from "./lib/submitLibs";
import ReadPage from "./components/ReadPage";
import { readRoster } from "./lib/readRoster";
import { script } from "./lib/script";
import GeneratingRoomCodePageWithRouter from "./components/GeneratingRoomCodePageWithRouter";
import EnterRoomCodePageWithRouter from "./components/EnterRoomCodePageWithRouter";
import YouHaveJoinedPage from "./components/YouHaveJoinedPage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import FetchingPromptsPageWithRouter from "./components/FetchingPromptsPageWithRouter";
import ExplainPage from "./components/ExplainPage";
import LoggingInPageWithRouter from "./components/LoggingInPageWithRouter";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import ContactUs from "./components/ContactUs";
import ExplainVideoPage from "./components/ExplainVideoPage";
import SedersPageWithRouter from "./components/SedersPageWithRouter";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#81181f" },
  },
  typography: { useNextVariants: true },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user:
        localStorage &&
        localStorage.getItem &&
        localStorage.getItem("user-email") &&
        localStorage.getItem("user-nickname") &&
        localStorage.getItem("user-sub")
          ? {
              email: localStorage.getItem("user-email"),
              nickname: localStorage.getItem("user-nickname"),
              sub: localStorage.getItem("user-sub"),
            }
          : false,
      isSigningIn: true,
      confirmedRoomCode: false,
      confirmedGameName: false,
      isRingleader: false,
      chosenPath: false,
      assignmentsData: false,
    };
  }
  _isMounted = false;
  persistState = () => {
    if (this.state.confirmedRoomCode) {
      localStorage.setItem("roomCode", this.state.confirmedRoomCode);
    }
    if (this.state.confirmedGameName) {
      localStorage.setItem("gameName", this.state.confirmedGameName);
    }
    if (this.state.chosenPath) {
      localStorage.setItem("chosenPath", this.state.chosenPath);
    }
    if (this.state.assignmentsData) {
      localStorage.setItem(
        "assignmentsData",
        JSON.stringify(this.state.assignmentsData)
      );
    }
  };
  handleVisibilityChange = () => {
    if (document.hidden) {
      this.persistState();
    }
  };
  componentDidMount() {
    this._isMounted = true;
    window.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("pagehide", this.persistState);
  }
  componentWillUnmount() {
    window.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("pagehide", this.persistState);
    this._isMounted = false;
  }
  setConfirmedRoomCode = (roomCode) => {
    this.setState({ confirmedRoomCode: roomCode });
  };
  setConfirmedGameName = (gameName) => {
    this.setState({ confirmedGameName: gameName });
  };
  setChosenPath = (path) => {
    this.setState({ chosenPath: path });
  };
  setAssignmentsData = (assignmentsData) => {
    this.setState({ assignmentsData: assignmentsData });
  };
  goToYourRoomCodePage = (history) => {
    history.push("/your-room-code");
  };
  setUser = (user) => {
    this.setState({ user });
  };
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
          <CssBaseline />
          <Router>
            <div className="App">
              <Route
                path="/privacy-policy"
                exact
                render={() => <PrivacyPolicy />}
              />
              <Route path="/terms" exact render={() => <TermsOfService />} />
              <Route path="/contact-us" exact render={() => <ContactUs />} />
              <Route
                path="(/|/index.html)"
                exact
                render={(props) => (
                  <HomePage
                    {...props}
                    user={this.state.user}
                    setUser={this.setUser}
                    storage={localStorage}
                  />
                )}
              />
              <Route
                path="/logging-in"
                exact
                render={(props) => (
                  <LoggingInPageWithRouter
                    setUser={this.setUser}
                    browserWindow={window}
                    storage={localStorage}
                  />
                )}
              ></Route>
              <Route
                path="/seders"
                exact
                render={(props) => (
                  <SedersPageWithRouter
                    user={this.state.user}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setChosenPath={this.setChosenPath}
                    setConfirmedGameName={this.setConfirmedGameName}
                    setAssignmentsData={this.setAssignmentsData}
                  />
                )}
              ></Route>
              <Route
                path="/explain"
                exact
                render={(props) => <ExplainPage {...props} />}
              />
              <Route
                path="/explain-video"
                exact
                render={(props) => <ExplainVideoPage {...props} />}
              />
              <Route
                path="/pick-script"
                exact
                render={(props) => (
                  <PickScriptPage
                    {...props}
                    getScripts={getScriptsFromApi}
                    setChosenPath={this.setChosenPath}
                  />
                )}
              />
              <Route
                path="/generating-room-code"
                exact
                render={(props) => (
                  <GeneratingRoomCodePageWithRouter
                    {...props}
                    goToYourRoomCodePage={this.goToYourRoomCodePage}
                    setChosenPath={this.setChosenPath}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    chosenPath={this.state.chosenPath}
                    user={this.state.user}
                  />
                )}
              />
              <Route
                path="/about"
                exact
                render={(props) => <About {...props} />}
              />
              <Route
                path="/how-to-play"
                exact
                render={(props) => <HowToPlay {...props} />}
              />
              <Route
                path="/enter-room-code"
                exact
                render={(props) => (
                  <EnterRoomCodePageWithRouter
                    {...props}
                    joinSeder={joinSeder}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                    user={this.state.user}
                  />
                )}
              />
              <Route
                path="/you-have-joined"
                exact
                render={(props) => (
                  <YouHaveJoinedPage
                    {...props}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    confirmedGameName={this.state.confirmedGameName}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                  />
                )}
              />
              <Route
                path="/your-room-code"
                exact
                render={(props) => (
                  <YourRoomCodePage
                    {...props}
                    joinSeder={joinSeder}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    user={this.state.user}
                  />
                )}
              />
              <Route
                path="/roster"
                exact
                render={(props) => (
                  <RosterPage
                    {...props}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    confirmedGameName={this.state.confirmedGameName}
                    roster={roster}
                    closeSeder={closeSeder}
                    chosenPath={this.state.chosenPath}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                    setChosenPath={this.setChosenPath}
                  />
                )}
              />
              <Route
                path="/let-them-press-button"
                exact
                render={(props) => (
                  <LetThemPressButtonPage
                    {...props}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    confirmedGameName={this.state.confirmedGameName}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                  />
                )}
              />
              <Route
                path="/fetching-prompts"
                exact
                render={(props) => (
                  <FetchingPromptsPageWithRouter
                    {...props}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    confirmedGameName={this.state.confirmedGameName}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                    assignments={assignments}
                    setAssignmentsData={this.setAssignmentsData}
                  />
                )}
              />
              <Route
                path="/play"
                exact
                render={(props) => (
                  <PlayPage
                    {...props}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    confirmedGameName={this.state.confirmedGameName}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                    submitLibs={submitLibs}
                    assignmentsData={this.state.assignmentsData}
                    setAssignmentsData={this.setAssignmentsData}
                  />
                )}
              />
              <Route
                path="/submitted"
                exact
                render={(props) => (
                  <SubmittedPage
                    {...props}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    confirmedGameName={this.state.confirmedGameName}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                  />
                )}
              />
              <Route
                path="/done-not-reading"
                exact
                render={(props) => (
                  <DoneNotReadingPage
                    {...props}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    confirmedGameName={this.state.confirmedGameName}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                  />
                )}
              />
              <Route
                path="/read"
                exact
                render={(props) => (
                  <ReadPage
                    {...props}
                    confirmedRoomCode={this.state.confirmedRoomCode}
                    confirmedGameName={this.state.confirmedGameName}
                    roster={readRoster}
                    script={script}
                    setConfirmedRoomCode={this.setConfirmedRoomCode}
                    setConfirmedGameName={this.setConfirmedGameName}
                  />
                )}
              />
            </div>
          </Router>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default App;
