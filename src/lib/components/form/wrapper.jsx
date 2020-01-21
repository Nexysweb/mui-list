import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';


class Wrapper extends Component {
  render() {
    const { label, name, errors, mandatory, inline, style, shrink, widthAuto, className } = this.props;

    // TODO: manage focus by passing onFocus / onBlur to FormLabel
    const labelProps = {}
    if (shrink) labelProps.shrink = true;

    let errorArr, errorMsg = null;
    if (errors && name in errors) errorArr = errors[name];
    if (errorArr) errorMsg = errorArr.map(e => e).join(", "); // i18n.translate(e)

    const control = (
      <StyledFormControl error={!!errorMsg} required={mandatory} fullWidth={!widthAuto} label={!!label}>
        {label ? <InputLabel htmlFor={name} {...labelProps} className={className}>{label}</InputLabel> : '' }
        {React.cloneElement(this.props.children, { required: mandatory, name })}
        {errorMsg ? <FormHelperText style={{fontSize: 14}}>{errorMsg}</FormHelperText> : ''}
      </StyledFormControl>
    );

    if (inline) {
      return style ? <InlineWrapper style={style}>{control}</InlineWrapper> : control;
    } else {
      return (
        <FormControlWrapper style={style}>{control}</FormControlWrapper>
      );
    }
  }
}

const StyledFormControl = styled(FormControl)`
  z-index: initial !important;
  ${props => props.label && `
    label {
      padding-left: 10px;
    }
  `}
`

const FormControlWrapper = styled.div`
  margin-bottom: 15px;
`

const InlineWrapper = styled.div`
  display: inline-block;
  margin-right: 10px;

  &:last-child {
    margin-right: 0px;
  }
`

Wrapper.propTypes = {
  children: PropTypes.element.isRequired,
  errors: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  mandatory: PropTypes.bool,
  inline: PropTypes.bool
}

export default Wrapper;