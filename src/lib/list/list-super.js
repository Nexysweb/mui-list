import React from 'react';

import NexysUtil from '@nexys/utils';

import { ColCell, HeaderUnit, FilterUnit, Row, OrderController } from './ui/index';
import { addRemoveToArray } from './filter-utils';

const { get } = NexysUtil.ds;

export default class ListSuper extends React.Component {
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
    const { sortDescAsc, filters } = this.state

    return this.props.def.map((h, i) => {
      const label = h.label === null ? null : h.label || h.name;
      
      // console.log(sortDescAsc)

      //const order = label ? <OrderControllerUpAndDown onClick={descAsc => this.setOrder(h.name)}/> : null;
      const order = typeof h.sort === 'boolean' && h.sort === true ? <OrderController descAsc={sortDescAsc} onClick={descAsc => this.setOrder(h.name)}/> : null;
      const filter = <FilterUnit key={i} filters={filters} name={h.name} filter={h.filter} onChange={this.setFilter}/>;
      return <HeaderUnit key={i}>{label} {order} {filter}</HeaderUnit>;
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
      } else {
 
        // if string
        filters[v.name] = v.value === '' ? null : v.value;
      }
    }

    // when a filter is applied, the page index is reset
    const pageIdx = 1;

    this.setState({filters, pageIdx});
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