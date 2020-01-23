import React from 'react';
//import PropTypes from 'prop-types';

//import Icon from './icon';
//import Input from '../form/input';

export default props => {
  //const state = { value: props.value || '' };
  const name = 'search';
  const { onChange } = props;

  /*static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }*/

  const handleChange = e => {
    const value = e.target.value;
    //this.setState({value});
    const v = {name, value};
    onChange(v);
  }

  return <input type="text" name={name} onChange={handleChange}/>

    /*return (<div className="input-group">
      <div className="input-group-addon">
        <Icon name="search" />
      </div>
      <Input placeholder="Search..." name="search" value={value} onChange={this.handleChange} />
    </div>)*/
  }
