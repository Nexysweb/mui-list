import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ReactPaginate from 'react-paginate';

import IconButton from '../../icon-button.jsx';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

/*
  const StyledButton = styled(Button)`
    padding: 3px !important;
    min-width: 5px !important;
    min-height: 12px !important;
*/

const PagesWrapper = styled.div`
  ul {
    display: flex;
    list-style-type: none;
    padding-left: 0;
    margin: 0;

    li {
      a {
        padding: 3px !important;
        min-width: 5px !important;
        min-height: 12px !important;
        font-size: 12px;
        color: #777;
      }

      &.selected {
        margin-top: -1px;
        a {
          text-decoration: underline;
          color: #333;
          font-weight: bold;
        }
      }

      &.previous, &.next {
        display: none;
      }

      &.break {
        font-size: 12px;
      }
    }
  }
`;

class TablePaginationActions extends Component {
  handleFirstPageButtonClick = event => this.props.onChangePage(event, 0);

  handleBackButtonClick = event => this.props.onChangePage(event, this.props.page - 1);

  handleNextButtonClick = event => this.props.onChangePage(event, this.props.page + 1);

  handleLastPageButtonClick = event => this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1));

  handlePageClick = (event, page) => {
    const { onChangePage } = this.props;
    if (event.selected || event.selected === 0) {
      onChangePage(null, event.selected);
    } else onChangePage(event, page);
  }

  render() {
    const { count, page, rowsPerPage } = this.props;

    const numPages = Math.ceil(count / rowsPerPage); 

    /*
      DEPRECATED pages code
      pages = [...Array(Math.ceil(count / rowsPerPage)).keys()];
      {pages.map(currPage => <StyledButton key={currPage} size="small" onClick={e => this.handlePageClick(e, currPage)} disabled={page === currPage}>{currPage+1}</StyledButton>)}
    */

    const pages = (
      <ReactPaginate
        forcePage={page}
        pageCount={numPages}
        pageRangeDisplayed={10}
        marginPagesDisplayed={3}
        onPageChange={this.handlePageClick}
      />
    );

    return (
      <div style={{minWidth: 'max-content', marginLeft: '20px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page">
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page">
          <KeyboardArrowLeft />
        </IconButton>
        <PagesWrapper>{pages}</PagesWrapper>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page">
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page">
          <LastPageIcon />
        </IconButton>
      </div>
    );
  }
}
  
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

export default TablePaginationActions;