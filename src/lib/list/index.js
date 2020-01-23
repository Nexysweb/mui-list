import React from 'react';
import PropTypes from 'prop-types';
//import Loader from '../loader';
import Search from './search';
import Body from './body';
import Pagination from './pagination';

import { applyFilter } from './filters-utils';

const Loader = props => <span>Loader</span>

export default class TableIndex extends React.Component {
  constructor(props) {
    super(props);

    const defaultItemsPerPage = 20;
    const itemsPerPage = Number(this.props.itemsPerPage) || defaultItemsPerPage;
    const paginationPosition = props.paginationPosition || 'bottom';

    const pagination = {
      itemsPerPage,
      page: 1
    };

    const filters = props.filters || {};

    const data = this.props.data;

    this.state = {
      data,
      pagination,
      paginationPosition,
      filters
    };
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    /** Array of columns with mandatory fields key and title */
    columns: PropTypes.array.isRequired,
    itemsPerPage: PropTypes.number,
    /** Default sorting object of type {key: <column key>, asc: <true/false>} */
    sortDefault: PropTypes.object,
    /** If true, search bar is displayed */
    search: PropTypes.bool,
    /** Optional callback to be passed when the page is changed. Useful if a service is called on page change */
    onTableChange: PropTypes.func,
    /** Optional number of all records. Should be passed if not all data are loaded at once, to calculate the number of pages. */
    count: PropTypes.number,
    /** If true, a spinner will be displayed instead of the content. Should be used during data load. */
    loading: PropTypes.bool,
    /** Callback function to be called if a filter per column is used */
    onFilter: PropTypes.func,
    /** If there is a need to apply filters on the page load, the filters object can be passed to the component */
    filters: PropTypes.object,
    /** Possible values 'top', 'bottom' and 'both'. Default is 'bottom' */
    paginationPosition: PropTypes.string,
    /** Indicates whether total number of lines should be displayed on top of the table. Default value is false */
    showTotal: PropTypes.bool
  }

  handleSearch = (data) => {
    const pagination = this.state.pagination;
    pagination.page = 1;
    this.setState({data, pagination});
  }

  handlePagination = (pagination) => {
    this.setState({pagination});
    if (this.props.onTableChange) {
      this.props.onTableChange(pagination);
    }
  }

  handleSort = () => {
    const pagination = this.state.pagination;
    pagination.page = 1;
    this.setState({pagination});
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { data, itemsPerPage } = newProps;
    const { pagination } = this.state;
    if ( itemsPerPage ) {
      pagination.itemsPerPage = itemsPerPage;
    }
    this.setState({data, pagination});
  }

  handleFilter = (fName, fValue) => {
    const { onFilter } = this.props;
    console.log(fName)
    console.log(fValue)

    if (onFilter && typeof onFilter === 'function') {
      onFilter(fName, fValue);
    } else {
      const { filters } = this.state;
      filters[fName] = fValue;
      const data = applyFilter(this.props.data, filters);

      this.setState({data});
    }
  }

  renderBody() {
    return (<Body
      {...this.props}
      columns={this.props.columns}
      pagination={this.state.pagination}
      loading={this.props.loading}
      sortDefault={this.props.sortDefault}
      onChange={this.handleSort}
      onFilter={this.handleFilter}
      filters={this.props.filters}
      count={this.props.count}
      data={this.state.data}
      />);
  }

  render() {
    const { search, columns, showTotal, count } = this.props;
    const { data } = this.state;

    const searchBar = search ? <Search data={this.props.data} columns={columns} onChange={this.handleSearch}/> : null;
    if (data === null) {
      return <Loader/>;
    }
    const paginationTop = (this.state.paginationPosition === 'top' || this.state.paginationPosition === 'both') &&
      <Pagination data={this.state.data} pagination={this.state.pagination} onChange={this.handlePagination} count={this.props.count}/>;
    const paginationBottom = (this.state.paginationPosition === 'bottom' || this.state.paginationPosition === 'both') &&
      <Pagination data={this.state.data} pagination={this.state.pagination} onChange={this.handlePagination} count={this.props.count}/>;

    const countNum = showTotal ? <div className="pull-right"><i>Total <strong>{count || this.props.data.length}</strong> records</i></div> : null;
    return (<div>
      { searchBar }
      { paginationTop }
      { countNum }
      { this.renderBody() }
      { paginationBottom }
    </div>);
  }
}