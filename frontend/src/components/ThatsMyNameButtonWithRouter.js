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
export default withStyles(styles)(ThatsMyNameButtonWithRouter);
