import React from 'react';
import PropTypes from 'prop-types';

import { ChevronLeft, ChevronRight } from '@material-ui/icons';

/**
 * 
 * @param {*} s selected
 * @param {*} n number of pages
 */
export const determineDisplayedSegment = (s, n) => {
  if (n < 5) {
    return Array.from({length: n}, (x, i) => i + 1);
  }
  const length = 3;
  let lowerBound = 1;
  switch (s) {
    case 1:
      lowerBound = 0;
      break;
    case 2:
    case (n - 1):
      lowerBound = 1;
      break;
    case n:
      lowerBound = 2;
      break;
    default:
  }
  return Array.from({length}, (x, i) => i + (s - lowerBound));
}

const liStyle = {float: 'left', margin: '3px', cursor: 'pointer'}

export default class TablePagination extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    count: PropTypes.number
  }

  handlePagination = (r) => {
    const page = Number(r.currentTarget.id);

    const pagination = this.props.pagination;

    pagination.page = page;

    this.props.onChange(pagination);
  }

  handleNextPrevious = (e) => {
    const dir = Number(e.currentTarget.id);
    const pagination = this.props.pagination;
    const newPage = dir === 1 ? pagination.page - 1 : pagination.page + 1;

    const n = this.props.count ? this.props.count : this.props.data.length;
    const nPage = Math.ceil(n / this.props.pagination.itemsPerPage);

    if (newPage < 1 ||  newPage > nPage) {
      return;
    }

     pagination.page = newPage;
    this.props.onChange(pagination);
  }

  handleJump = (e) => {
    const dir = Number(e.currentTarget.id);
    const pagination = this.props.pagination;
    pagination.page = dir === 1 ? pagination.page - 3 : pagination.page + 3;
    this.props.onChange(pagination);
  }

  render() {
    if (this.props.data && this.props.data.length === 0) {
      return null;
    }
    const data = this.props.data;
    const n = this.props.count ? this.props.count : data.length;
    const nPage = Math.ceil(n / this.props.pagination.itemsPerPage);

    if (nPage === 1) {
      return null;
    }
    const selected = this.props.pagination.page;

    const pClass = 'list-item-pagination';
    const displayedSegment = determineDisplayedSegment(selected, nPage);
    const pages = displayedSegment.map(x => {
      /* eslint-disable */
      return (<li style={liStyle}  key={x} className={pClass}>
        <a id={x} onClick={this.handlePagination} style={{fontWeight: selected === x ? 'bold' : 'normal'}} className={(selected === x) ? 'pagination pagination-selected' : 'pagination'}>
          {x}
        </a>
      </li>);
      /* eslint-enable */
    });

    // special rules
    // 1. jump to previous pages button: should be visible if (first of displayed segment - 1) > 0
    if ((displayedSegment[0] - 1) > 1 && nPage > 4) {
      /* eslint-disable-next-line */
      pages.unshift(<li style={liStyle}  key="jumpPrev" className={pClass}><a id={1} onClick={this.handleJump} className="pagination">...</a></li>);
    }
    // 2. first page button: should be displayed if it is not in the displayedSegment
    if (!displayedSegment.includes(1)) {
      /* eslint-disable-next-line */
      pages.unshift(<li style={liStyle}  key={1} className={pClass}><a id={1} onClick={this.handlePagination} className="pagination">1</a></li>);
    }
    // 3. jump to next pages button: should be visible if last of the displayed segment is at least 1 more than the real last
    if ((nPage - (displayedSegment[displayedSegment.length - 1])) > 1 && nPage > 4) {
      /* eslint-disable-next-line */
      pages.push(<li style={liStyle} key="jumpNext" className={pClass}><a id={2} onClick={this.handleJump} className="pagination">...</a></li>);
    }
    // 4. last page button: should be visible if it is not in the displayed segment
    if (!displayedSegment.includes(nPage)) {
      /* eslint-disable-next-line */
      pages.push(<li style={liStyle} key={nPage} className={pClass}><a id={nPage} onClick={this.handlePagination} className="pagination">{nPage}</a></li>);
    }
    // 5, 6. Next and previous buttons should always be there
    /* eslint-disable-next-line */
    pages.unshift(<li style={liStyle} key="prev" className={selected === 1 ? `${pClass} disabled` : pClass}><a id={1} onClick={this.handleNextPrevious} className="pagination"><ChevronLeft/></a></li>);
    /* eslint-disable-next-line */
    if(selected < nPage) {
      console.log(`${selected} - ${nPage}`)
      pages.push(<li style={liStyle} key="next" className={selected === nPage ? `${pClass} disabled` : pClass}><a id={2} onClick={this.handleNextPrevious} disabled={selected === nPage} className="pagination"><ChevronRight/></a></li>);
    }

    return (
      <ul style={{listStyleType: 'none'}}>
        {pages}
      </ul>
    );
  }
}

