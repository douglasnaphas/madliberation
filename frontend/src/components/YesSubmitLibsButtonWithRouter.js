import Button from '@mui/material/Button';
import React from 'react';
import { withRouter } from 'react-router-dom';

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
export default YesSubmitLibsButtonWithRouter;
