import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import Utils from '@nexys/utils';


class MyInput extends Component {
  constructor(props) {
    super(props);
    this.processProps(props, true);
  }

  // TODO: number vs text
  processProps = (props, init) => {
    // get type
    let type = '';
    switch (props.type) {
      case 'email':
        type = 'email';
        break;
      case 'password':
        type = 'password';
        break;
      case 'tel':
        type = 'tel';
        break;
      default: // set text as default
        type = 'text';
        break;
    }

    const name = props.name;
    const value = props.value;

    let disabled = false;
    if (props.disabled) disabled = true;

    // formatted value - value that will be displayed
    const fValue = this.formatValue(props.value);

    let style = this.inputStyle();
    style.height = '56px';
    style.marginTop = '5px';
    if (props.style) style = { ...style, ...props.style };

    // value is raw input, fValue is formatted input
    const state = {
      type,
      name,
      value,
      fValue,
      style,
      disabled
    };

    /* eslint-disable react/no-direct-mutation-state */
    if (init) this.state = state;
    else this.setState({...state});
    //this.setState({...state});
  }

  // depending on the 'type' format the value
  formatValue(v) {
    switch (this.props.type) {
      case 'number':
        return Utils.number.formatNumber(v);
      default: {
        let fval = v;
        if (fval === undefined) fval = '';
        return fval;
      }
    }
  }

  isNumberType() {
    switch (this.props.type) {
      case 'number':
        return true;
      default:
        return false;
    }
  }

  // depending on the 'type' assign style
  inputStyle() {
    switch (this.props.type) {
      case 'number':
        return {textAlign: 'right', paddingRight: '5px'};
      default:
        return {};
    }
  }

  handleChange = event => {
    // get new value
    let newValue = event.target.value;
    if (!this.isNumberType() || (this.isNumberType() && (Utils.number.isNumeric(newValue) || newValue === ''))) {
      if (this.isNumberType()) {
        if (newValue === '') {
          newValue = 0;
        } else {
          newValue = parseFloat(newValue);
        }
      }
      // update state
      this.setState({fValue: newValue});

      // calls parent function
      this.props.onChange({name: this.state.name, value: newValue});
    }
  }

  handleBlur = event => {
    const { onBlur } = this.props;
    if (onBlur) onBlur(event);
  }

  componentWillReceiveProps(nextProps) {
    this.processProps(nextProps, false);
  }

  render() {
    let { placeholder, noUnderline, focus, prefix, suffix, area, rows, rowsMax } = this.props;
    const { type } = this.state;
    return (
      <StyledInput
        type={type ? type : 'text'}
        value={this.state.fValue ? this.state.fValue : ''}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        placeholder={placeholder}
        autoFocus={focus ? true : false}
        disabled={this.state.disabled ? true : undefined}
        disableUnderline={noUnderline}
        startAdornment={prefix && prefix}
        endAdornment={suffix && <InputAdornment position="end">{suffix}</InputAdornment>}
        multiline={area && true}
        rows={rows}
        rowsMax={rowsMax}
        fullWidth
      />
    );
  }
}

const StyledInput = styled(Input)`
  input, textarea {
    padding-left: 10px;
  }
`

MyInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  errors: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  mandatory: PropTypes.bool,
  disabled: PropTypes.bool
};

export default MyInput;