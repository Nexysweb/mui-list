import React, { Component } from 'react';
import styled from 'styled-components';

import MyOption from './option.jsx';
import { FormControl, FormLabel } from '@material-ui/core';


class MyOptionGroup extends Component {
  renderOptions = options => {
    const { name, selectedValue, handleChange, selectedColor, simple } = this.props;

    // TODO: support multiselect
    return options.map((option, idx) => {
      // NOTE: handle boolean values (otherwise id is used to fallback on falsE value)
      const value = typeof option.value === 'boolean' ? option.value : (option.value || option.id);
      const checked = selectedValue === value;

      return (
        <MyOption 
          key={`${name}-option-${idx}`}
          selected={checked}
          handleChange={handleChange}
          selectedColor={selectedColor && checked ? selectedColor : 'black'}
          {...option}
          name={name}
          value={value}
          label={option.label || option.name}
          simple={simple || false}
        />
      );
    });
  }

  render() {
    let { all, label, style, options, compact } = this.props;

    options = all ? [{ id: 0, name: 'All' }].concat(options) : options;

    return (
      <StyledFormControl component="div" compact={!!compact} style={style}>
        {label && <StyledFormLabel component="span" className="label">{label}</StyledFormLabel>}
        <div className="options">{this.renderOptions(options)}</div>
      </StyledFormControl>
    );
  }
}

const StyledFormControl = styled(FormControl)`
  display: flex !important;
  flex-direction: row !important;
  justify-content: ${props => (props.compact ? 'flex-start' : 'space-between')} !important;

  .label {
    margin-right: 15px;
  }

  .options {
    display: flex;
    flex-wrap: wrap;
    margin-left: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column !important;

    .label {
      display: none;
    }

    .options {
      margin: 0;
    }
  }
`;

const StyledFormLabel = styled(FormLabel)`
  line-height: 47px !important;
  width: auto;
  float: left;
`;

export default MyOptionGroup;