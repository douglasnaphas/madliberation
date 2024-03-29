import Button from '@mui/material/Button';
import React from 'react';
import { withRouter } from 'react-router-dom';

class ThatsMyNameButton extends React.Component {
  render() {
    const {
      history,
      joinSederAndGoToRoster,
      tentativeGameName,
      thatsMyNameButtonPressed
    } = this.props;
    const thatsMyNameClick = event => {
      joinSederAndGoToRoster(history);
    };

    return (
      <div>
        <Button
          madliberationid="thats-my-name-button"
          color="primary"
          variant="contained"
          disabled={!tentativeGameName || thatsMyNameButtonPressed}
          onClick={thatsMyNameClick}
        >
          That's my name
        </Button>
      </div>
    );
  }
}
const ThatsMyNameButtonWithRouter = withRouter(ThatsMyNameButton);
export default ThatsMyNameButtonWithRouter;
