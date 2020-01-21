import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';

import Loader from './loader.jsx';


class MyButton extends Component {
  render() {
    const { label, type, onClick, href, target, primary, flat, outlined, form, focus, loading, disabled, prefix, fullWidth } = this.props;
    let { suffix, style } = this.props;

    let additionalProps = {};
    if (form) additionalProps.form = form;

    if (loading) 
      suffix = (
        <span style={{display: 'inline-block'}}>
          <Loader thickness={1} radius={18} />
        </span>
      );

    let color = "default";
    if (primary) color = "primary";

    let variant = null;
    if (flat) {
      variant = 'text';
    } else if (outlined) {
      variant = 'outlined'
    } else {
      variant = 'contained'
    }

    if (!style) style = {};
    if (fullWidth) style.width = '100%';

    // NOTE: icon is either passed as prefix or suffix
    const btn = (
      <Button
        type={type ? type : 'button'}
        autoFocus={focus ? true : false}
        onClick={onClick}
        disabled={loading || disabled}
        color={color}
        href={href}
        variant={variant}
        style={style}>
        {prefix}
        <StyledSpan suffixed={!!suffix} prefixed={!!prefix}>{label}</StyledSpan>
        {suffix}
      </Button>
    );

    if (target) {
      return (
        <Link to={target}>{btn}</Link>
      );
    } else {
      return btn;
    }
  }
}

const StyledSpan = styled.span`
  ${props => props.prefixed && `
    margin-left: 5px;
  `}

  ${props => props.suffixed && `
    margin-right: 5px;
  `}
`

// NOTE: accessing MUI themes from component (https://stackoverflow.com/questions/43281020/reference-to-themes-primary-color-instead-of-a-specific-color-in-material-ui)
export default MyButton;