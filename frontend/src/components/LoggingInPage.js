import React, { useEffect } from "react";
import MenuAppBar from "./MenuAppBar";
import Typography from "@mui/material/Typography";
// import withStyles from "@mui/styles/withStyles";
import { Configs } from "../Configs";

// const styles = (theme) => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   input: {
//     display: "none",
//   },
// });

function LoggingInPage({ history, setUser, browserWindow, storage }) {
  useEffect(() => {
    const { href, search } = browserWindow.location;
    const params = new URLSearchParams(search);
    const user = {
      nickname: params.get("nickname"),
      email: params.get("email"),
    };
    setUser(user);
    storage.setItem("user-nickname", user.nickname);
    storage.setItem("user-email", user.email);
    browserWindow.history.replaceState(
      {},
      document.title,
      href.substring(0, href.indexOf("?"))
    );
    history.push("/");
  }, [history, setUser, browserWindow, storage]);
  return (
    <>
      <MenuAppBar></MenuAppBar>
      <br />
      <div>
        <Typography variant="h4">Logging you in...</Typography>
      </div>
    </>
  );
}
export default /*withStyles(styles)(*/LoggingInPage/*)*/;
// TODO: Get the user info (nickname and email) from the URL query params.
// Remove the call to /id.
