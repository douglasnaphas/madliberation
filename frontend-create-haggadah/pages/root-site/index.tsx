/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MadLiberationLogo from "../../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../../public/VAPLogo-white.png";
import { jsx } from "@emotion/react";
import { Button, Paper } from "@mui/material";

interface UserInfo {
  user_nickname?: string;
  user_email?: string;
}

export default function RootSiteHome() {
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/v2/user", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        setUserInfo(j || null);
      })
      .catch(() => {
        setUserInfo(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const isLoggedIn =
    !!userInfo && !!userInfo.user_nickname && !!userInfo.user_email;

  return (
    <div
      style={{
        backgroundColor: "#81181f",
        minHeight: "100%",
      }}
    >
      <img
        css={{
          height: "200px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        src={`${MadLiberationLogo.src}`}
        alt="Mad Liberation: Let My People LOL"
      />

      <Container maxWidth="sm">
        <Paper style={{ padding: "16px" }}>
          <Typography component="h1" variant="h6" align="center">
            Mad lib Haggadahs for your Passover Seder
          </Typography>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              {...({ madliberationid: "plan-seder-button" } as any)}
              variant="contained"
              color="primary"
              href="/create-haggadah/index.html"
              disabled={!isLoggedIn || loading}
            >
              Plan a seder
            </Button>
            {!isLoggedIn && !loading && (
              <Typography component="p" style={{ marginTop: "8px" }}>
                <em>Requires login</em>
              </Typography>
            )}
          </div>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            {!isLoggedIn ? (
              <a href="/v2/login" style={{ textDecoration: "none" }}>
                <Button
                  {...({ madliberationid: "login-button" } as any)}
                  title="Log in"
                  variant="contained"
                  color="secondary"
                >
                  Log in
                </Button>
              </a>
            ) : (
              <>
                <Typography component="p">
                  Logged in as {userInfo?.user_nickname}
                </Typography>
                <Typography component="p" style={{ marginTop: "6px" }}>
                  <Button
                    {...({ madliberationid: "see-your-seders-button" } as any)}
                    href="/create-haggadah/seders.html"
                    title="see-your-seders-button"
                  >
                    See your seders
                  </Button>
                </Typography>
              </>
            )}
          </div>
        </Paper>
      </Container>

      <img
        css={{
          height: "70px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "24px",
          paddingBottom: "24px",
        }}
        src={`${VeryAwesomePassoverLogo.src}`}
        alt="Very Awesome Passover"
      />
    </div>
  );
}
