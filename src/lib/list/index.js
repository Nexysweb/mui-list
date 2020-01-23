import React from 'react';

import NexysUtil from '@nexys/utils';

import { NoRow, ColCell, HeaderUnit, Row, OrderController, ListWrapper, ListContainer, ListHeader, ListBody, RecordInfo } from './ui';
import { SearchUnit } from './form';

import { order, orderWithPagination } from './order-utils';
import { applyFilter } from './filter-utils';

import Pagination from './pagination';

import GlobalSearch from './global-search';

const { get } = NexysUtil.ds;

export const addRemoveToArray = (v, a = []) => {
  if(!a) {
    return [v]
  }

  if (a.includes(v)) {
    const idx = a.indexOf(v);
    a.splice(idx, 1)

    return a;
  }

  a.push(v);

  return a;
}

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
      // if object
      if (typeof v.value !== 'string') {

        if (!filters[v.name]) {
          filters[v.name] = {value: [], func: v.value.func};
        }

        filters[v.name].value = addRemoveToArray(v.value.value, filters[v.name].value);
        console.log(filters)
        
      } else {
 
        // if string
        filters[v.name] = v.value === '' ? null : v.value;
      }
    }

    // when a filter is applied, the page index is reset
    const pageIdx = 1;

    this.setState({filters, pageIdx});
  }

  renderFilters() {
    const { filters } = this.state;

    return this.props.def.map((h, i) => {
      if ((typeof h.filter === 'boolean' && h.filter === true) || (typeof h.filter === 'object' && h.filter.type === 'string')) {
        return (<HeaderUnit key={i}>
          <SearchUnit name={h.name} value={filters[h.name]} onChange={v => this.setFilter( v)}/>
        </HeaderUnit>);
      }

      if (typeof h.filter === 'object' && h.filter.type === 'category' && Array.isArray(h.filter.options)) {
      return <HeaderUnit key={i}>
        {h.filter.options.map((option, i) => <span key={i}><input  type="checkbox" onChange={v => this.setFilter({name: h.name, value: {value: option.id, func: h.filter.func}})}/> {option.name}<br/></span>)}
      </HeaderUnit>
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

    this.render();
  }

  render() {
    const { data, nPerPage = 5, config = {} } = this.props;
    const { filters, pageIdx, sortAttribute, sortDescAsc } = this.state;

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


