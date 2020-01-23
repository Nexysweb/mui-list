import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Header from './header';
import DigisI18n from '@nexys/digis-i18n';
import utils from '@nexys/utils';

import { 
  Table, TableBody, TableCell, TableContainer, TableRow
 } from '@material-ui/core';

 import { Alert } from '@material-ui/lab';

const StyledRow = styled(TableRow)`
  ${props => props.borderless && `
    td {
      border-bottom: none !important;
    }
  `}
  height: 32px !important;
  &:first-child {
    td {
      border-top: none !important;
    }
  }
  &:last-child {
    td {
      border-bottom: none !important;
    }
  }
  td, th {
    padding: 0 10px 0 5px !important;
    font-size: 14px !important;
    border-bottom: 2px solid #f3f3f3;
    > div {
      // max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  div[role="button"] {
    font-size: 12px !important;
  }
  button {
    &.icon-button {
      padding: 3px;
      height: auto;
      margin-left: 3px;
    }
  }
`;

const Loader = props => <span>Loader</span>

const { I18n } = DigisI18n;
const { get } = utils.ds;

const Col = props => {
  const {row, col} = props;
  const attr = col.key;
  const r = col.render ? col.render : x => get(col.key, x);

  return (<TableCell style={col.style} key={attr}>
    {r(row)}
  </TableCell>);
}

export default class MyTableBody extends React.Component {
  constructor(props) {
    super(props);

    const pagination = this.props.pagination;
    const sort = this.props.sortDefault ? this.props.sortDefault : {key: null, asc: true};

    const filter = null;

    const table = {
      sort
    };

    this.state = {
      table,
      pagination,
      filter
    };

    this.handleSort = this.handleSort.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    // this.handleSearch = this.handleSearch.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nProps) {
    const pagination = nProps.pagination;

    this.setState({pagination});
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    pagination: PropTypes.object,
    onChange: PropTypes.func,
    sortDefault: PropTypes.object,
    onFilter: PropTypes.func,
    filters: PropTypes.object,
    loading: PropTypes.bool,
    count: PropTypes.number,
    className: PropTypes.string
  }

  handleSort(r) {
    const key = r.currentTarget.id;
    const asc = r.currentTarget.name === 'true';

    // reset page
    const page = 1;

    const sort = {
      key,
      asc
    };

    const table = this.state.table;
    table.sort = sort;

    const pagination = this.state.pagination;
    pagination.page = page;

    this.setState({table, pagination});
    this.props.onChange(pagination);
  }

  handlePagination(r) {
    const page = Number(r.currentTarget.id);

    const pagination = this.state.pagination;

    pagination.page = page;

    this.setState({pagination});
  }

  handleFilter(fName, fValue) {
    if (typeof this.props.onFilter === 'undefined') {
      // if no onSearch is passed, filter by search within the component
      const filter = this.state.filter === null ? {} : this.state.filter;
      filter[fName] = fValue;
      this.setState({filter});
    } else {
      this.props.onFilter(fName, fValue);
    }
  }

  renderRows(rows, columns) {
    if (this.props.loading) {
      return <StyledRow><TableCell colSpan={columns.length}><center><div style={{width: '40%'}}><Loader/></div></center></TableCell></StyledRow>;
    }
    if (rows.length === 0) {
      return <StyledRow>
        <TableCell colSpan={columns.length}>
          <center><div style={{width: '60%'}}>
            <Alert severity="info">{I18n.translate('users.noRecords')}</Alert>
          </div></center>
        </TableCell>
      </StyledRow>;
    }
    return rows.map((r, i) => {
      return (<tr key={i}>
        {columns.map((c, i) => {
          return <Col key={i} col={c} row={r}/>;
        }
        )}
      </tr>);
    });
  }

  /**
   * compares two rows
   * @param a: row 1
   * @param b: row 2
   * @param attr: object attributre that is used for comparison
   * @return {1, 0, -1}
   */
  compareRow(a, b, attr) {
    let valueA = get(attr, a);
    let valueB = get(attr, b);

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();

      return valueA.localeCompare(valueB);
    }

    if (valueA > valueB) {
      return 1;
    }

    return -1;
  }

  renderTable(data, columns) {
    if (data === null) {
      return null;
    }
    const pagination = this.state.pagination;
    const sort = this.state.table.sort;

    // const n = data.length;
    const itemsPerPage = pagination.itemsPerPage;
    const page = pagination.page;

    // sort
    // there are 3 types of sorting possible
    // - 1. no sorting
    // - 2. sorting by an attribute (most obvious one)
    // - 3. custom function
    const sortAttr = sort.key;
    // default sort function: no sorting (1)
    /* eslint-disable no-unused-vars */
    let sortFunc = (a, b) => 0;

    if (sortAttr) {
      const sortFuncs = columns.filter(x => {
        return x.key === sortAttr;
      });

      // custom sorting (3)
      if (sortFuncs[0] && sortFuncs[0].sortFunc && typeof sortFuncs[0].sortFunc === 'function') {
        sortFunc = sortFuncs[0].sortFunc;
      } else {
        // sort by attribute (2)
        sortFunc = (a, b) => this.compareRow(a, b, sortAttr);
      }
    }

    const sData = data
    .filter(d => {
      return this.state.filter === null || Object.keys(this.state.filter).every(k => d[k].toLowerCase().includes(this.state.filter[k]));
    })
    .sort((a, b) => {
      if (sort.asc) {
        return -sortFunc(a, b);
      }

      return sortFunc(a, b);
    });
    const pData = this.props.count ? sData : sData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    //const classes = useStyles();

    return (<TableContainer><Table style={{tableLayout: 'fixed'}} aria-label="simple table">
      <Header
        columns={columns}
        onSort={this.handleSort}
        onFilter={this.props.onFilter}
        filters={this.props.filters}
        />
      {/*this.renderHead(columns)*/}
      <TableBody>
        {this.renderRows(pData, columns)}
      </TableBody>
    </Table></TableContainer>);
  }

  render() {
    return this.renderTable(this.props.data, this.props.columns);
  }
}