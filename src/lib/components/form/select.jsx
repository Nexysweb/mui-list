import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';


class MySelect extends Component {
  handleChange = event => {
    const { onChange, name } = this.props;
    const value = event.target.value;
    this.setState({value});
    onChange({name, value});
  }

  render() {
    const { name, value, values=[], disabled, all, placeholder, multiple, adornment } = this.props;

    const options = values.map((x, i) => <MenuItem key={i+1} value={x.id}>{x.name}</MenuItem>)

    return (
      <StyledSelect
        value={value}
        onChange={this.handleChange}
        input={<Input name={name} endAdornment={<InputAdornment>{adornment}</InputAdornment>} />}
        placeholder={placeholder}
        disabled={disabled}
        multiple={multiple}>
        {all ? <MenuItem key={0} value={0}>{'select.all'}</MenuItem> : ''}
        {/* {i18n.translate('select.all', null, false) */ }
        {options}
      </StyledSelect>
    );
  }
}

const StyledSelect = styled(Select)`
  text-align: left;

  > div {
    &:first-child {
      padding-left: 10px;
    }
  }
`

MySelect.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.number,
  disabled: PropTypes.bool,
  mandatory: PropTypes.bool
};

export default MySelect;