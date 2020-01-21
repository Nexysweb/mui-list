import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';

class Alert extends Component {
  constructor(props) {
    super(props);

    const dismissible = props.dismissible;

    const myClass = ['alert', 'alert-' + this.props.color, (dismissible ? 'alert-dismissible' : null)].join(' ').trim();

    // by default show icon
    const showIcon = props.showIcon ? props.showIcon : false;

    this.state = {
      myClass,
      dismissible,
      showIcon
    };

    this.handleDismiss = this.handleDismiss.bind(this);
  }

  static propTypes() {
    return {
      color: React.PropTypes.string.isRequired,
      children: React.PropTypes.element.isRequired,
      dismissible: React.PropTypes.boolean,
      onDismiss: React.PropTypes.function,
      showIcon: React.PropTypes.boolean
    };
  }

  handleDismiss() {
    this.props.onDismiss(this.props);
  }

  render() {
    const { noMargin } = this.props;
    let dismissible = null;

    // to check
    /*if (this.state.dismissible) {
      dismissible = <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.handleDismiss}>
          <span aria-hidden="true">&times;</span>
        </button>;
    }*/

    let iconName;
    //const iconName = UiUtils.colorToIcon(this.props.color);

    let icon = null;
    // to check
    //if (iconName !== null && this.state.showIcon) icon = <Icon name={iconName} />;

    // TODO: use styled component instead of app.css classes (use standard orange, green etc)
    return (
      <div className={`${this.state.myClass}${noMargin ? '' : ' top-20'}`}>
        {dismissible}
        {icon}
        {this.props.children}
      </div>
    );
  }
}

export default Alert;