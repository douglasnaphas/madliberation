import React, { useEffect } from "react";
import MenuAppBar from "./MenuAppBar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { Configs } from "../Configs";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});

function LoggingInPage({ history, setUser, browserWindow, storage }) {
  useEffect(() => {
    const idUrl = new URL("./id", Configs.apiUrl());
    fetch(idUrl, {
      method: "GET",
      credentials: "include",
    })
      .then((r) => {
        return r.json();
      })
      .then((user) => {
        setUser(user);
        storage.setItem("user-nickname", user.nickname);
        storage.setItem("user-email", user.email);
        storage.setItem("user-sub", user.sub);
        const uri = browserWindow.location.toString();
        if (uri.indexOf("?") > 0) {
          const clean_uri = uri.substring(0, uri.indexOf("?"));
          browserWindow.history.replaceState({}, document.title, clean_uri);
        }
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
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
export default withStyles(styles)(LoggingInPage);
