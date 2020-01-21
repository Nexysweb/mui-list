import React, { Component } from 'react';
import styled from 'styled-components';

// import { withTheme } from '@material-ui/core/styles';


class Loader extends Component {
  render() {
    return (
      <div className={'loader ' + this.props.className}>
        <div className="ball-scale-ripple loader-inner">
          <div />
        </div>
      </div>
    );
  }
}

const StyledLoader = styled(Loader)`
  margin: 0 auto;

  .ball-scale-ripple > div {
    border: ${props => props.thickness}px solid ${props => props.color || '#0000ff'};
    width: ${props => props.radius}px;
    height: ${props => props.radius}px;
  }
`;


StyledLoader.defaultProps = {
  thickness: 2,
  radius: 50,
}

// export default withTheme()(StyledLoader);
export default StyledLoader;