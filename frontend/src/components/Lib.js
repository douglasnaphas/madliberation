/** @jsxImportSource @emotion/react */
import Button from "@mui/material/Button";
import { madLiberationStyles } from "../madLiberationStyles";
import Paper from "@mui/material/Paper";
import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { Global } from "@emotion/react";

const styles = { ...madLiberationStyles };

class Lib extends Component {
  state = {};
  _isMounted = false;
  onAnswerChange = (event) => {
    const { setAnswer, libIndex } = this.props;
    setAnswer(event.target.value, libIndex);
  };
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {
      lib,
      libIndex,
      libCount,
      incrementLibIndex,
      decrementLibIndex,
      answer,
    } = this.props;
    return (
      <div>
        <div>
          <Global styles={styles} />
        </div>
        <div>
          <Typography component="p" paragraph gutterBottom>
            Enter a word or phrase to replace...
          </Typography>
          <div>
            <Paper className="paper">
              <Typography variant="h5">
                <label htmlFor={`prompt-${libIndex}`}>
                  {lib ? lib.prompt : ""}
                </label>
              </Typography>
            </Paper>
          </div>
          <br />
          <TextField
            madliberationid={`answer-${libIndex}`}
            variant="outlined"
            fullWidth
            onChange={this.onAnswerChange}
            id={`prompt-${libIndex}`}
            value={answer && answer.answer ? answer.answer : ""}
          />
          {lib && lib.sentence ? (
            <div>
              <br />
              <Typography component="span">
                Your answer should complete the sentence:{" "}
                <span className="blueItalic">
                  {lib.sentence.replace(/_/, "__")}
                </span>
              </Typography>
            </div>
          ) : (
            ""
          )}
          {lib && lib.example ? (
            <div>
              <br />
              <Typography component="span">
                For example, you could write:{" "}
                <span className="blueItalic">{lib.example}</span>
              </Typography>
            </div>
          ) : (
            ""
          )}
        </div>
        <br />
        <div madliberationid="lib-progress">
          {libIndex + 1} / {libCount}
        </div>
        <br />
        <div>
          {libIndex < libCount - 1 ? (
            <div>
              <Button
                madliberationid="next-prompt"
                color="primary"
                variant="contained"
                onClick={incrementLibIndex}
              >
                Next
              </Button>
              <br />
              <br />
            </div>
          ) : (
            <div>
              <br />
            </div>
          )}
        </div>
        <div>
          {libIndex === 0 ? (
            <div>
              <br />
            </div>
          ) : (
            <div>
              <Button
                madliberationid="previous-prompt"
                onClick={decrementLibIndex}
                color="secondary"
                variant="contained"
              >
                Previous
              </Button>
              <br />
              <br />
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Lib;
