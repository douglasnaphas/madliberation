import Button from '@material-ui/core/Button';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
});

class SubmitLibsButton extends React.Component {
  render() {
    const { history, confirmAndSubmit } = this.props;
    const submitClick = event => {
      confirmAndSubmit(history);
    };

    return (
      <div>
        <Button
          madliberationid="submit-libs-button"
          variant="contained"
          color="primary"
          onClick={submitClick}
        >
          That's everyone
        </Button>
      </div>
    );
  }
}
const SubmitLibsButtonWithRouter = withRouter(SubmitLibsButton);
export default withStyles(styles)(SubmitLibsButtonWithRouter);
