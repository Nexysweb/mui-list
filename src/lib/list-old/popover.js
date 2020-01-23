import React from 'react';
import PropTypes from 'prop-types';
import Popover, { ArrowContainer } from 'react-tiny-popover';
//import Icon from '../icon';

const Icon = props => <span>Icon</span>

export default class MyPopover extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onTogglePopover: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.node, PropTypes.element, PropTypes.string
    ]),
    trigger: PropTypes.oneOfType([
      PropTypes.node, PropTypes.element, PropTypes.string
    ]),
    selected: PropTypes.bool
  }

  render() {
    const { name, isOpen, onTogglePopover, children, icon, selected } = this.props;
    const style = {
      backgroundColor: '#fff',
      border: 'solid',
      borderColor: '#ddd',
      borderWidth: '1px',
      borderRadius: '4px 4px 0 0 ',
      maxHeight: '250px',
      padding: '10pt',
      overflow: 'auto'
    };

    const filterStyle = { color: selected ? '#5596E6' : '#a4a4a4' };


    const trigger = <span style={filterStyle} id={name} onClick={_ => this.props.onTogglePopover(name)}><Icon name={icon}/></span>

    return (
      <Popover
        isOpen={isOpen}
        position={['bottom']}
        padding={10}
        onClickOutside={onTogglePopover}
        content={({ position, targetRect, popoverRect }) => (
          <ArrowContainer
            position={position}
            targetRect={targetRect}
            popoverRect={popoverRect}
            arrowColor="#fff"
            arrowSize={10}
            arrowStyle={{ opacity: 0.7 }}
            >
              <div style={style}>
                { children }
              </div>
          </ArrowContainer>
        )}
        >
          { trigger }
      </Popover>
    )
  }
}