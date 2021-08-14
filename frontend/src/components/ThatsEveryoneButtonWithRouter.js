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
          color="secondary"
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
export default withStyles(styles)(ThatsEveryoneButtonWithRouter);
