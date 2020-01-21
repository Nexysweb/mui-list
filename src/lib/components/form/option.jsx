import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import Icon from '@material-ui/core/Icon';

import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const StyledFormControlLabel = styled(FormControlLabel)`
  padding: 7px 3px;
  padding-right: 13px;
  background-color: ${props => props.style.bgColor};
  border-radius: 5px;
  border: 1px solid #eaeaea;
  margin: 2px;
  ${props => props.style.selectedColor !== 'black' && css`
    border: 2px solid ${props.style.selectedColor};
  `}

  &:hover {
    background-color: ${props => props.style.bgHoverColor};
  }

  span:first-child {
    height: auto !important;
    width: 36px !important;
  }
`;

const StyledRadio = styled(Radio)`
  padding: 0 !important;
`

class MyOption extends Component {
  constructor(props) {
    super(props);
    this.optionStyles = {
      bgColor: '#f8f8f8',
      bgHoverColor: '#efefef'
    };
  }

  handleChange = e => {
    const { name, value } = this.props;
    this.props.handleChange({name, value});
  }

  render() {
    const { value, name, label, selected, checkedIcon, uncheckedIcon, selectedColor, simple } = this.props;

    let radio = (
      <StyledRadio
        name={name}
        checked={selected}
        icon={<Icon color="primary">{uncheckedIcon}</Icon>}
        checkedIcon={<Icon color="primary">{checkedIcon}</Icon>}
        onChange={this.handleChange}
      />
    );

    if (simple) {
      radio = (
        <StyledRadio
          name={name}
          checked={selected}
          onChange={this.handleChange}
          color="primary"
        />
      );
    }

    const optionStyles = {
      ...this.optionStyles,
      selectedColor
    };

    return <StyledFormControlLabel value={value} control={radio} label={label} style={optionStyles} />;
    // label={i18n.translate(label)}
  }
}

MyOption.propTypes = {
  label: PropTypes.string.isRequired
};

export default MyOption;