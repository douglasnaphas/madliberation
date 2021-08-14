import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';

const styles = theme => ({});

class ReadRoster extends React.Component {
  state = { rosterLoading: true, done: [], notDone: [], dialogOpen: false };
  _isMounted = false;
  fetchRoster = (roomCode, gameName) => {
    return () => {
      const { roster, requestScript } = this.props;
      if (this._isMounted) this.setState({ rosterLoading: true });
      roster(roomCode, gameName).then(d => {
        if (d.status === 200) {
          if (this._isMounted) {
            if (d.data.notDone.length < 1) {
              requestScript(); // tells parent: don't render me, I'm done
              return;
            }
            this.setState({
              rosterLoading: false,
              done: d.data.done,
              notDone: d.data.notDone
            });
          }
        }
      });
    };
  };
  onDialogClose = event => {
    if (this._isMounted) this.setState({ dialogOpen: false });
  };
  confirmRequestScript = () => {
    if (this._isMounted) this.setState({ dialogOpen: true });
  };
  componentDidMount() {
    this._isMounted = true;
    const { confirmedRoomCode, confirmedGameName } = this.props;
    this.fetchRoster(confirmedRoomCode, confirmedGameName)();
  }
  componentDidUpdate(prevProps) {
    const { confirmedRoomCode, confirmedGameName } = this.props;
    const {
      confirmedRoomCode: prevCode,
      confirmedGameName: prevName
    } = prevProps;
    if (confirmedRoomCode === prevCode && confirmedGameName === prevName)
      return;
    this.fetchRoster(confirmedRoomCode, confirmedGameName)();
  }
  render() {
    const { requestScript, confirmedRoomCode, confirmedGameName } = this.props;
    const { done, notDone } = this.state;
    if (!confirmedRoomCode || !confirmedGameName) {
      return <div />;
    }
    if (this.state.rosterLoading) {
      return <CircularProgress />;
    }
    const doneRows = [];
    for (let i = 0; i < done.length; i++) {
      doneRows.push(
        <TableRow key={`doneRow${done[i]}`}>
          <TableCell key={`doneCell${done[i]}`}>{done[i]}</TableCell>
        </TableRow>
      );
    }
    const notDoneRows = [];
    for (let i = 0; i < notDone.length; i++) {
      notDoneRows.push(
        <TableRow key={`notDoneRow${notDone[i]}`}>
          <TableCell key={`notDoneCell${notDone[i]}`}>{notDone[i]}</TableCell>
        </TableRow>
      );
    }
    return (
      <div>
        <div>
          <Typography component="p" paragraph>
            These sedergoers have submitted their answers:
          </Typography>
        </div>
        <div>
          <Table>
            <TableBody>{doneRows}</TableBody>
          </Table>
        </div>
        <br />
        <div>
          <Typography component="p" paragraph>
            These have not:
          </Typography>
        </div>
        <div>
          <Table>
            <TableBody>{notDoneRows}</TableBody>
          </Table>
        </div>
        <br />
        <div>
          <Button
            variant="contained"
            onClick={this.fetchRoster(confirmedRoomCode, confirmedGameName)}
            disabled={this.state.rosterLoading}
          >
            Check again
          </Button>
        </div>
        <br />
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.confirmRequestScript}
            disabled={this.state.rosterLoading}
          >
            Get script anyway
          </Button>
        </div>
        <Dialog open={this.state.dialogOpen} onClose={this.onDialogClose}>
          <DialogTitle id="confirm-get-script-dialog">
            Get the script?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-get-script-dialog-description">
              Some people have not submitted their answers! If you get the
              script now, their answers will not be included.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onDialogClose}>Cancel</Button>
            <Button color="secondary" onClick={requestScript}>
              Yes, get the script
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ReadRoster);
