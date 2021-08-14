import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';

// takes in JSON collection of scripts, and a function it will call to set
// its parent's state when a selection is made

const styles = theme => ({
  root: {
    display: 'flex'
  },
  formControl: {
    margin: theme.spacing(3)
  },
  group: {
    margin: theme.spacing(1)
  }
});

class ScriptTable extends React.Component {
  state = {
    selectedValue: '0',
    selectedScript:
      (this.props.scripts && this.props.scripts.length) > 0
        ? this.props.scripts[0]
        : {}
  };
  handleChange = event => {
    this.setState({
      selectedValue: event.target.value,
      selectedScript: this.props.scripts[event.target.value]
    });
  };
  render() {
    const { classes, scripts, setChosenPath } = this.props;
    const scriptRows = [];
    for (let i = 0; i < scripts.length; i++) {
      const scriptUid = `${scripts[i].room_code}-${scripts[i].lib_id}`;
      scriptRows[i] = (
        <TableRow key={`row${scriptUid}`}>
          <TableCell key={`${scriptUid}-select`}>
            <Radio
              key={`${scriptUid}-radio`}
              checked={this.state.selectedValue === `${i}`}
              onChange={this.handleChange}
              value={`${i}`}
              id={`script-${i}`}
            />
          </TableCell>
          <TableCell key={`${scriptUid}-short_desc`}>
            <label
              htmlFor={`script-${i}`}
              madliberationid={`${scripts[i].haggadah_short_desc}`}
            >
              {scripts[i].haggadah_short_desc}
            </label>
          </TableCell>
          <TableCell key={`${scriptUid}-description`}>
            {scripts[i].haggadah_description}
          </TableCell>
        </TableRow>
      );
    }
    const pickButton =
      scripts.length > 0 ? (
        <div>
          <br />
          <Button
            madliberationid="pick-this-script-button"
            variant="contained"
            className={classes.button}
            component={Link}
            onClick={e => {
              setChosenPath(this.state.selectedScript.path);
            }}
            to="/generating-room-code"
          >
            Use this one
          </Button>
        </div>
      ) : (
        ''
      );
    return (
      <div>
        <div>
          <Table>
            <TableBody>{scriptRows}</TableBody>
          </Table>
        </div>
        {pickButton}
      </div>
    );
  }
}

ScriptTable.propTypes = {
  setChosenPath: PropTypes.func.isRequired,
  scripts: PropTypes.arrayOf(
    PropTypes.shape({
      room_code: PropTypes.string.isRequired,
      lib_id: PropTypes.string.isRequired,
      haggadah_description: PropTypes.string.isRequired,
      haggadah_short_desc: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ).isRequired
};

export default withStyles(styles)(ScriptTable);
