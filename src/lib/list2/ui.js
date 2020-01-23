import React from 'react';

//import Icon from '../../components/icon';
import Alert from 'lib/components/alert';
import { paginationBoundaries } from './order-utils';

import { 
  Table, TableBody, TableCell, TableContainer, TableRow, TableHead
 } from '@material-ui/core';

 import { KeyboardArrowUp as ChevronUp, KeyboardArrowDown as ChevronDown, ImportExport } from '@material-ui/icons';

 const Icon = props => <span>{props.name}</span>

export class NoRow extends React.Component {
  render() {
    if (this.props.n > 0) {
      return null;
    }

    return <Alert type="warning">No rows found</Alert>;
  }
}

export class PaginationWrapper extends React.Component {
  render() {
    return (<nav>
      <ul className="pagination">
        {this.props.children}
      </ul>
    </nav>);
  }
}

export const PaginationUnit = props => {
    const { isDisabled } = props;

    // here we disable the button in case it is not valid
    if (isDisabled) {
      return null;
    }

    const className = 'page-item' + (props.isActive ? ' active' : '') + (isDisabled ? ' disabled' : '');
    return <li className={className}><button className="page-link" onClick={props.onClick}>{props.children}</button></li>;
}

export const ColCell = props => {
  const { children} = props;
  return <TableCell>{children}</TableCell>
}

export class HeaderUnit extends React.Component {
  render() {
    const { children} = this.props;
    return <TableCell>{children}</TableCell> 
  }
}

export class OrderControllerUpAndDown extends React.Component {
  render() {
    return (<span>
      <span key={"asc"} onClick={_ => this.props.onClick(true)}><ChevronUp/></span>
      <span key={"desc"} onClick={_ => this.props.onClick(false)}><ChevronDown/></span>
    </span>);
  }
}

export class OrderController extends React.Component {
  render() {
    return (<span onClick={_ => this.props.onClick(null)}><ImportExport/></span>);
  }
} 

export class ListWrapper extends React.Component {
  render() {
    const { children} = this.props;
    return <div className="table-responsive-sm">{children}</div>;
  }
}

export class ListContainer extends React.Component {
  render() {
    const { children} = this.props;
    return <Table>{children}</Table>;
  }
}

export class Row extends React.Component {
  render() {
    const { children} = this.props;
    return <TableRow>{children}</TableRow>;
  }
}

export class ListHeader extends React.Component {
  render() {
    const { children} = this.props;
    return <TableHead>{children}</TableHead>;
  }
}

export class ListBody extends React.Component {
  render() {
    const { children} = this.props;
    return <TableBody>{children}</TableBody>;
  }
}

export class RecordInfo extends React.Component {
  render() {
    const { nPerPage, idx, n } = this.props;

    if (n === 0) {
      return null;
    }

    const { start, end } = paginationBoundaries(idx, nPerPage);
    return <p className="pull-right">Showing {start + 1} to {(Number(start) + Number(nPerPage)) > n ? n : end} of {n} entries</p>
  }
}