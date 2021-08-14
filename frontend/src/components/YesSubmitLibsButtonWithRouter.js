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

class YesSubmitLibsButton extends React.Component {
  render() {
    const { history, submitLibsAndGoToSubmittedPage } = this.props;
    const yesSubmitLibsClick = event => {
      submitLibsAndGoToSubmittedPage(history);
    };

    return (
      <div>
        <Button
          madliberationid="yes-submit-libs-button"
          disabled={this.props.disabled}
          onClick={yesSubmitLibsClick}
        >
          Yes, submit
        </Button>
      </div>
    );
  }
}
const YesSubmitLibsButtonWithRouter = withRouter(YesSubmitLibsButton);
export default withStyles(styles)(YesSubmitLibsButtonWithRouter);
