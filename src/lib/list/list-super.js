import React, { useState } from 'react';

import Utils from '@nexys/utils';

import { order, orderWithPagination } from './order-utils';
import { applyFilter, addRemoveToArray } from './filter-utils';

const stateDefault = {
  sortAttribute: null,
  sortDescAsc: true,
  filters: {},
  pageIdx: 1
};

export default ( {HeaderUnit, FilterUnit, OrderController, ColCell, GlobalSearch, NoRow, Row, ListWrapper, ListContainer, ListHeader, ListBody, RecordInfo, Pagination} ) => props => {
  const [ state, setState ] = useState(stateDefault);

  const { def, data, nPerPage = 5, config = {} } = props;
  const { filters, pageIdx, sortAttribute, sortDescAsc } = state;

  const renderHeaders = () => {
    return def.map((h, i) => {
      const label = h.label === null ? null : h.label || h.name;

      const order = typeof h.sort === 'boolean' && h.sort === true ? <OrderController descAsc={sortDescAsc} onClick={descAsc => setOrder(h.name)}/> : null;
      const filter = <FilterUnit key={i} filters={filters} name={h.name} filter={h.filter} onChange={setFilter}/>;
      return <HeaderUnit key={i}>{label} {order} {filter}</HeaderUnit>;
    })
  }

  // this manages both strings and categories
  const setFilter = (v) => {
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
      } else {
 
        // if string
        filters[v.name] = v.value === '' ? null : v.value;
      }
    }

    // when a filter is applied, the page index is reset
    const pageIdx = 1;

    setState({...state, filters, pageIdx});
  }
  /**
   * defines order to apply
   * @param  {[type]} name    attribute/column
   * @param  {[type]} descAsc true/false - asc or desc. if null, will toggle
   * @return {[type]}         [description]
   * todo: allow custom ordering
   */
  const setOrder = (name, descAsc = null) => {
    if (descAsc === null) {
      descAsc = !sortDescAsc;
    }

    setState({...state, pageIdx: 1, sortDescAsc: descAsc, sortAttribute: name});
  }

  const changePage = pageIdx => {
    // todo block beyond max page
    if (pageIdx > 0) {
      setState({...state, pageIdx});
    }
  }

  const renderBody = (data) => data.map((row, i) => <tr key={i}>
    {def.map((h, j) => {
      return <ColCell key={j}>{h.render ? h.render(row) : Utils.ds.get(h.name, row)}</ColCell>
    })}
  </tr>);

  const fData = applyFilter(data, filters);
  const n = fData.length;
  const pData = orderWithPagination(order(fData, sortAttribute, sortDescAsc), pageIdx, nPerPage);

  return (<ListWrapper>
    <GlobalSearch config={config} onChange={v => setFilter(v)} filters={filters}/>
    <ListContainer>
      <ListHeader>
        <Row>
          {renderHeaders()}
        </Row>
      </ListHeader>

      <ListBody>
        {renderBody(pData)}
      </ListBody>
    </ListContainer>
  
    <RecordInfo n={n} idx={pageIdx} nPerPage={nPerPage}/>
    <Pagination n={n} nPerPage={nPerPage} idx={pageIdx} onClick={v => changePage(v)}/>

    <NoRow n={n}/>
  </ListWrapper>);
}
