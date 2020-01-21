import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';


class OverflowTooltip extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  componentDidMount() {
    const el = this.element;
    const hasOverflowingChildren = el.offsetWidth < el.scrollWidth;
    this.setState({ show: hasOverflowingChildren });
  }

  render() {
    const { placement, style, children } = this.props;
    const { show } = this.state;

    const childWrapper = (
      <div style={style || {}} ref={el => this.element = el}>
        {children}
      </div>
    );

    return show ? (
      <Tooltip
        id="tooltip"
        placement={placement || "top"}
        title={children}>
        {childWrapper}
      </Tooltip>
    ) : childWrapper;
  }
}

OverflowTooltip.propTypes = {
  placement: PropTypes.string,
  style: PropTypes.object
}

export default OverflowTooltip;