import React from 'react';
import styled from 'styled-components';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';

import TablePaginationActions from './pagination/actions.jsx';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import IconButton from '../icon-button.jsx';


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

const ExpandButton = ({expanded, handleClick}) => (
  <IconButton onClick={handleClick}> 
    {expanded ? <ExpandLess /> : <ExpandMore />}
  </IconButton>
);

const ExpandedRow = ({columns, children}) => (
  <StyledRow borderless>
    <TableCell colSpan={columns.length}>
      <Table style={{margin: '10px 0 5px 15px'}}>
        <TableHead>
          {columns}
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableCell>
  </StyledRow>
);

export {
  Table,
  TableHead,
  TableBody,
  StyledRow as TableRow,
  ExpandedRow,
  TableCell,
  ExpandButton,
  TableFooter,
  TableSortLabel,
  TablePagination,
  TablePaginationActions
};