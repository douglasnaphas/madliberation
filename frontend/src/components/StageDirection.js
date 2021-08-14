import React, { Component } from 'react';
import { madLiberationStyles } from '../madLiberationStyles';

class StageDirection extends Component {
  render() {
    const { children, sayStageDirection } = this.props;
    return (
      <span style={madLiberationStyles.boldItalicLightBlueBackground}>
        {(sayStageDirection ? "[Don't read this]:" : '') + children}
      </span>
    );
  }
}
export default StageDirection;
