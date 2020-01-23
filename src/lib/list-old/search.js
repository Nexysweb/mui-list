import React from 'react';
import PropTypes from 'prop-types';
import SearchBox from './search-box';

import { applyFilter } from './filters-utils';


export default class TableIndex extends React.Component {
  handleChange = r => {
    const globalSearch = r.value;
    const data = applyFilter(this.props.data, { globalSearch })

    this.props.onChange(data);
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    return (<div className="row">
      <div className="col-md-6" />
      <div className="col-md-6">
        <SearchBox onChange={this.handleChange}/>
      </div>
    </div>);
  }
}