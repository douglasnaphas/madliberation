import Button from '@mui/material/Button';
import React from 'react';
import { withRouter } from 'react-router-dom';

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
export default SubmitLibsButtonWithRouter;
