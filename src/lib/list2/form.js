import React from 'react';

/*import Icon from '../../components/icon';
import Input from '../../form/input';
import InputAppend from '../../form/input-append';

export class SearchUnit extends React.Component {
  render() {
    const { name, value, onChange } = this.props;
    return (<div className="input-group">
      <Input name={name} value={value} onChange={v => onChange(v)}/>
      <InputAppend>
        <Icon name="search"/>
      </InputAppend>
    </div>)
  }
}*/


//import PropTypes from 'prop-types';

//import Icon from './icon';
//import Input from '../form/input';

export const SearchUnit = props => {
  //const state = { value: props.value || '' };

  const { name, value, onChange } = props;

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
