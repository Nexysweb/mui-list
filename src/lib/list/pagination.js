import React from 'react';

import { PaginationUnit, PaginationWrapper } from './ui';
import { getPagination, getPageTiles } from './pagination-utils';

class Unit extends React.Component {
  render() {
    const {k, isActive} = this.props;
    return <PaginationUnit isActive={isActive} onClick={x => this.props.onClick(k)}>{k}</PaginationUnit>;
  }
}

export default class Pagination extends React.Component {
  render() {
    const {n, nPerPage, idx} = this.props;

    if (n === 0) {
      return null;
    }

    const pagination = getPagination(n, nPerPage)
    const { nPage } = pagination;

    const units = getPageTiles(idx, nPage).map((i) => {
      if ( i < 0 ) {
        return <PaginationUnit key={i} isDisabled={true}>...</PaginationUnit>;
      }

      return <Unit k={i} isActive={i === idx} key={i} onClick={x => this.props.onClick(x)}/>;
    });

    return (<PaginationWrapper>
      <PaginationUnit isDisabled={idx === 1} onClick={x => this.props.onClick(idx - 1)}>&laquo;</PaginationUnit>
      {units}
      <PaginationUnit isDisabled={idx === nPage} onClick={x => this.props.onClick(idx + 1)}>&raquo;</PaginationUnit>
    </PaginationWrapper>)
  }
}