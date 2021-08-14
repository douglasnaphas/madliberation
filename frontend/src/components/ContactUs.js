import React, { Component } from "react";
import MenuAppBar from "./MenuAppBar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
});

class ContactUs extends Component {
  render() {
    return (
      <div>
        <MenuAppBar />
        <div madliberationid="contact-us-page">
          <br />
          <Typography variant="h2" gutterBottom>
            Contact Us
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            Email <a href="mailto:admin@passover.lol">admin@passover.lol</a>{" "}
            with any concerns.
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            In particular, you can contact us if we sent you an email as part of
            our account verification process, and you did not intend to sign up.
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            If you have logged in with a social media site like Facebook, you
            can email us to request that any of your data that we have obtained
            from the social media site about you be deleted from Mad Liberation.
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            If you have logged in with your email address, you can email us to
            request that we delete your email address from Mad Liberation.
          </Typography>
          <Typography variant="h3" gutterBottom>
            Problems with the site during your seder
          </Typography>
          <Typography component="p" paragraph gutterBottom>
            <b>
              If you're mid-seder and having a problem with this site, do not
              hesitate to text the maintainer, Doug, at 814-880-0875 for prompt
              assistance.
            </b>
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ContactUs);
