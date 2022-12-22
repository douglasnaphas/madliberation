import Button from '@mui/material/Button';
import React from 'react';
import { withRouter } from 'react-router-dom';

class ThatsEveryoneButton extends React.Component {
  state = {
    yesClicked: false
  };
  setYesClicked = () => {
    this.setState({ yesClicked: true });
  };
  render() {
    const { history, closeSederAndPlay, setDialogButtonClicked } = this.props;
    const thatsEveryoneClick = event => {
      setDialogButtonClicked(true);
      this.setYesClicked();
      closeSederAndPlay(history);
    };

    return (
      <div>
        <Button
          madliberationid="confirm-thats-everyone-button"
          onClick={thatsEveryoneClick}
          disabled={this.state.yesClicked}
        >
          Yes
        </Button>
      </div>
    );
  }
}
const ThatsEveryoneButtonWithRouter = withRouter(ThatsEveryoneButton);
export default ThatsEveryoneButtonWithRouter;
