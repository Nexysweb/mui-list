import React from 'react';

//import { PaginationUnit, PaginationWrapper } from './ui';
import { getPagination, getPageTiles } from './pagination-utils';

/*const Unit = props => {
  const {k, isActive} = props;
  return <PaginationUnit isActive={isActive} onClick={x => this.props.onClick(k)}>{k}</PaginationUnit>;
}*/

const Pagination = ({PaginationWrapper, PaginationUnit}) => props => {
  const {n, nPerPage, idx, onClick } = props;

  if (n === 0) {
    return null;
  }

  const pagination = getPagination(n, nPerPage)
  const { nPage } = pagination;

  const units = getPageTiles(idx, nPage).map((i) => {
    if ( i < 0 ) { // this does not seem to work, to be fixed
      return <PaginationUnit key={i} isDisabled={true}>...</PaginationUnit>;
    }

    //return <Unit  isActive={} key={i} onClick={x => onClick(x)}/>;
    return <PaginationUnit key={i} isActive={i === idx} onClick={x => onClick(i)}>{i}</PaginationUnit>;
  });

  return <PaginationWrapper>
    <PaginationUnit isDisabled={idx === 1} onClick={x => onClick(idx - 1)}>&laquo;</PaginationUnit>
    {units}
    <PaginationUnit isDisabled={idx === nPage} onClick={x => onClick(idx + 1)}>&raquo;</PaginationUnit>
  </PaginationWrapper>;
}

export default Pagination;