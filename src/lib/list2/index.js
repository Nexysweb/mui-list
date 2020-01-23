import React from 'react';

import NexysUtil from '@nexys/utils';

import { NoRow, ColCell, HeaderUnit, Row, OrderController, ListWrapper, ListContainer, ListHeader, ListBody, RecordInfo } from './ui';
import { SearchUnit } from './form';

import { order, orderWithPagination } from './order-utils';
import { applyFilter } from './filter-utils';

import Pagination from './pagination';

import GlobalSearch from './global-search';

const { get } = NexysUtil.ds;

class ListSuper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortAttribute: null,
      sortDescAsc: true,
      filters: {},
      pageIdx: 1
    }
  }

  renderHeaders() {
    return this.props.def.map((h, i) => {
      const label = h.label === null ? null : h.label || h.name;

      //const order = label ? <OrderControllerUpAndDown onClick={descAsc => this.setOrder(h.name)}/> : null;
      const order = typeof h.sort === 'boolean' && h.sort === true ? <OrderController onClick={descAsc => this.setOrder(h.name)}/> : null;

      return <HeaderUnit key={i}>{label} {order}</HeaderUnit>;
    })
  }

  // this manages both strings and categories
  setFilter = (v) => {
    const { filters } = this.state;

    if (v.value === null || v.value === '') {
      //filters.filter(x => x.name !== )
      delete(filters[v.name]);
    } else {
      filters[v.name] = v.value === '' ? null : v.value;
    }

    // when a filter is applied, the page index is reset
    const pageIdx = 1;

    this.setState({filters, pageIdx});
  }

  renderFilters() {
    const { filters } = this.state;
    console.log(filters)
    
    return this.props.def.map((h, i) => {
      console.log(filters[h.name])

      if ((typeof h.filter === 'boolean' && h.filter === true) || typeof h.filter === 'object' && h.filter.type === 'string') {
        return (<HeaderUnit key={i}>
          <SearchUnit name={h.name} value={filters[h.name]} onChange={v => this.setFilter( v)}/>
        </HeaderUnit>);
      }

      if (typeof h.filter === 'object' && h.filter.type === 'category' && Array.isArray(h.filter.options)) {
      return <HeaderUnit key={i}>{h.filter.options.map((option, i) => <><input key={i} type="checkbox" onChange={v => this.setFilter(filters[h.name] ? {name: h.name, value: null} : {name: h.name, value: {id: option.id, func: h.filter.func}})}/> {option.name}<br/></>)}</HeaderUnit>
      }

      return <HeaderUnit key={i}/>;
    })
  }

  /**
   * defines order to apply
   * @param  {[type]} name    attribute/column
   * @param  {[type]} descAsc true/false - asc or desc. if null, will toggle
   * @return {[type]}         [description]
   * todo: allow custom ordering
   */
  setOrder = (name, descAsc = null) => {
    if (descAsc === null) {
      const { sortDescAsc } = this.state;
      descAsc = !sortDescAsc;
    }

    this.setState({pageIdx: 1, sortDescAsc: descAsc, sortAttribute: name});
  }

  changePage = pageIdx => {
    // todo block beyond max page

    if (pageIdx > 0) {
      this.setState({pageIdx});
    }
  }

  renderBody(data) {
    const { def } = this.props;
    
    return data.map((row, i) => {
      return (<tr key={i}>
        {def.map((h, j) => {
          return <ColCell key={j}>{h.render ? h.render(row) : get(h.name, row)}</ColCell>
        })}
      </tr>);
    });
  }

  render() {
    return null;
  }
}



export default class List extends ListSuper {
  componentDidUpdate(p) {
    console.log(p)
    console.log(this.props);

    this.render();
  }

  render() {
    const { data, nPerPage = 5, options, config = {} } = this.props;
    const { filters, pageIdx, sortAttribute, sortDescAsc } = this.state;
    console.log(filters);
    const fData = applyFilter(data, filters);
    const n = fData.length;

    const pData = orderWithPagination(order(fData, sortAttribute, sortDescAsc), pageIdx, nPerPage);

    return (<ListWrapper>
      <GlobalSearch config={config} onChange={v => this.setFilter(v)} filters={filters}/>
      <ListContainer>
        <ListHeader>
          <Row>
            {this.renderHeaders()}
          </Row>
          <Row>
            {this.renderFilters()}
          </Row>
        </ListHeader>
        <ListBody>
          {this.renderBody(pData)}
        </ListBody>
      </ListContainer>
    
      <RecordInfo n={n} idx={pageIdx} nPerPage={nPerPage}/>
      <Pagination n={n} nPerPage={nPerPage} idx={pageIdx} onClick={v => this.changePage(v)}/>

      <NoRow n={n}/>
    </ListWrapper>);
  }
}


