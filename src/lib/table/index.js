import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import styled from 'styled-components';

// todo: withDraggable
import { Alert, Tooltip, OverflowTooltip, IconButton, Loader, Button } from '../components';

import { Wrapper, Select, Input, withForm } from '../components/form';
//import withDragDropContext from '../components/withDragDropContext.js';

import {
  Table, 
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ExpandedRow,
  ExpandButton,
  TableFooter,
  TableSortLabel,
  TablePagination,
  TablePaginationActions
} from '../components/table';

import Icon from '@material-ui/core/Icon';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


import Utils from '@nexys/utils';


const SubMenu = styled(Menu)`
  ul {
    padding: 0 !important;

    li {
      height: 18px;
      padding: 12px;
    }
  }
`;


class MuiTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tooltips: {}
    };
  }

  createSortHandler = colName => e => this.props.onSort(colName);

  openFilterMenu = anchorName => event => this.setState({[anchorName]: event.currentTarget});
  closeFilterMenu = anchorName => e => this.setState({[anchorName]: null});

  handleFilter = (e, checked, item, colName) => this.props.onFilterChange(checked, item, colName);

  submitFilter = colName => {
    const { applyFilter } = this.props;
    const closeFilter = this.closeFilterMenu(colName);
    closeFilter();
    applyFilter(colName);
  }

  resetFilter = colName => {
    const { resetFilter } = this.props;
    const closeFilter = this.closeFilterMenu(colName);
    closeFilter();
    resetFilter(colName);
  }

  renderFilter = col => {
    const { filters } = this.props;
    const colFilters = filters[col.name];

    const anchorName = col.name;
    const anchorEl = this.state[anchorName];

    // TODO: refactor filters
    let columnFilters = col.table && col.table.filters;
    if (!Array.isArray(columnFilters)) columnFilters = this.props[columnFilters];

    return (
      <SubMenu
        id="filter-menu"
        anchorEl={anchorEl}
        onClose={this.closeFilterMenu(anchorName)}
        open={Boolean(anchorEl)}>
        {columnFilters.map(item => (
          <MenuItem onClick={() => {}} style={{paddingLeft: 15}}>
            <FormControlLabel
              control={
                <Checkbox
                  name={item.name}
                  color="primary"
                  checked={colFilters && colFilters[item.value || item.name]}
                  onChange={(e, checked) => this.handleFilter(e, checked, item, col.name)}
                />
              }
              label={item.label || item.name}
            />
          </MenuItem>
        ))}
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          {/* TODO: i18n.translate */}
          <Button onClick={() => this.submitFilter(col.name)} label={'submit'} primary flat />
          <Button onClick={() => this.resetFilter(col.name)} label={'reset'} primary flat />
        </div>
      </SubMenu>
    );
  }

  // TODO: hiddenColumns
  renderCols = (columns, actions={}, expandable, hasAction) => {
    hasAction = hasAction || expandable;

    let { create } = actions;
    let { sorting } = this.props;

    columns = columns.map((col, id) => {
      const value = col.renderHead ? col.renderHead(col) : col.label; // i18n.translate(col.label) 
      const nextSortOrder = (sorting && sorting.order === 'asc' ? 'desc' : 'asc') || 'desc';

      // NOTE: column filter
      let columnFilters = col.table && col.table.filters;
      if (!Array.isArray(columnFilters)) columnFilters = this.props[columnFilters];

      return (
        <TableCell
          key={`table-column-${id}`} 
          className={col.alignCenter && "text-center"}
          numeric={col.numeric || false}
          padding={col.disablePadding ? 'none' : 'default'}
          sortDirection={sorting && sorting.orderBy === col.name ? sorting.order : false}>
          {col.table && col.table.sorting ? 
            <Tooltip
              id={`${col.name}-sort-tooltip`}
              title={`Sort ${nextSortOrder}`}
              placement={col.numeric ? 'bottom-end' : 'bottom-start'}
              enterDelay={300}>
              <TableSortLabel
                active={sorting && sorting.orderBy === col.name}
                direction={(sorting && sorting.order) || 'desc'}
                onClick={this.createSortHandler(col.name)}>
                {value}
              </TableSortLabel>
            </Tooltip> : value
          }
          {columnFilters && (
            <Fragment>
              <Tooltip
                id={`${col.name}-filter-tooltip`}
                title={'filter.info'} // TODO: i18n.translate(..)
                placement="top"
                enterDelay={300}>
                <IconButton
                  style={{fontSize: 16}}
                  onClick={this.openFilterMenu(col.name)}>
                  <Icon style={{fontSize: 16}}>filter_list</Icon>
                </IconButton>
              </Tooltip>
              {this.renderFilter(col)}
            </Fragment>
          )}
        </TableCell>
      );
    });

    if (hasAction) {
      let col = <TableCell style={{width: 200}} />;
      if (create) {
        col = (
          <TableCell style={{width: 200, textAlign: 'right'}}>
            <IconButton onClick={e => this.props.add()}>
              <Icon color="primary">add_box</Icon>
            </IconButton> 
          </TableCell>
        );
      }
      columns = columns.concat([col]);
    }
    
    return columns;
  }
  
  renderFormElem = (editable, col, item, handleChange) => {
    const { errors } = this.props;

    const name = (editable && editable.name) || col.name;
    const value = Utils.ds.get(name, item);

    if (editable.render) {
      return editable.render(name, value, item, this.props);
    }

    const defaultValue = Utils.ds.get(editable.defaultName || name, item);
    switch (editable.type) {
      case 'select': {
        return (
          <Wrapper name={name} errors={errors} inline>
            <Select
              value={value || defaultValue}
              values={this.props[editable.values]}
              onChange={handleChange}
            />
          </Wrapper>
        )
      }
      default:
        return (
          <Wrapper name={name} errors={errors} inline>
            <Input
              type="text"
              value={value}
              onChange={handleChange}
              focus
            />
          </Wrapper> 
        );
    }
  }

  // TODO: if errors keep toggled
  submit = (e, handleSubmit, handleEscape) => {
    if (e.key) {
      if (e.key === 'Enter' && !e.shiftKey) {
        this.props.loadingUpdate();
        handleEscape();
      }
      handleSubmit(e);
    } else {
      this.props.loadingUpdate();
      handleEscape();
      handleSubmit(e);
    }
  }

  renderRowForm = (data, onChange, {save, cancel, deleteAction}, columns, i) => {
    // TODO: show loader inside row while update takes place
    const RowForm = withForm(({data, handleChange, handleSubmit, handleSubmitKey, handleEscape}) => (
      <TableRow key={i} onKeyUp={e => this.submit(e, handleSubmitKey, handleEscape)}>
        {columns.map((col, j) => (
          <TableCell
            padding={j===0 ? "none" : 'default'}
            numeric={col.numeric || false}
            className={col.alignCenter && "text-center"}>
            {col.editable ? (
              this.renderFormElem(col.editable, col, data, handleChange)
            ) : (
              <OverflowTooltip>{col.render(data, col, this.props)}</OverflowTooltip>
            )}
          </TableCell>
        ))} 
        <TableCell style={{width: 200, textAlign: 'right'}}>
          {/* TODO: i18n.translate(..) */}
          <Tooltip id="edit.save" enterDelay={500} title={'save'} placement="top">
            <IconButton onClick={e => this.submit(e, handleSubmit, handleEscape)}>
              <Icon color="primary">save</Icon>
            </IconButton>
          </Tooltip>
          {data.add ? (
            <Tooltip id="delete" enterDelay={500} title={'delete'} placement="top">
              {/* TODO: i18n.translate(..) */}
              <IconButton onClick={() => {
                handleEscape();
                deleteAction(data.id);
              }}>
                <Icon>delete</Icon>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip id="edit.cancel" enterDelay={500} title={'cancel'} placement="top">
              {/* TODO: i18n.translate(..) */}
              <IconButton onClick={handleEscape}>
                <Icon>cancel</Icon>
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    ));

    // TODO: handle nested errors
    // TODO: display errors without label
    return (
      <RowForm
        {...this.props}
        data={data}
        handleChange={onChange(data.id)}
        update={save}
        cancel={cancel}
        inline
      />
    );
  }

  assembleActions = (config={}, values, key) => {
    const { handleEdit, handleAdd, remove } = this.props;
    const { view=false, edit=false, update=false, create=false } = config;
    let { toggleEdit, toggleAdd } = this.props;
    let { delete: deleteAction=false } = config;

    let onChangeEdit, onChangeAdd = false;

    if (edit) {
      toggleEdit = toggleEdit(values, key);
      onChangeEdit = handleEdit(key);
    }

    if (create) {
      toggleAdd = toggleAdd(values, key);
      onChangeAdd = handleAdd(key);
      deleteAction = remove(key); 
    }

    return {
      view,
      edit,
      toggleEdit,
      update,
      toggleAdd,
      create,
      deleteAction,
      onChangeEdit,
      onChangeAdd
    };
  }

  renderRow = (item, actions, expandable, columns, parentKey, i) => {
    let { view, edit, deleteAction, toggle } = actions;
    // todo , draggable
    const { config, toggleExpansion } = this.props;

    /*** HETEROGENEOUS TABLE ***/
    let flip = false;
    if (config && config.union) {
      const { union } = config;
      if (union.condition) {
        flip = union.condition(item);
        if (flip) {
          deleteAction = union.delete;
          columns = union.columns;
          edit = false;
          view = false;
        }
      }
    }
    /***************************/

    /*** EXPANDABLE TABLE ***/
    let expandActions = null;
    let children = null;
    if (expandable) {
      children = item[expandable.children];
      // key = item.id => this.props.add(item.id)
      expandActions = (
        <Fragment>
          {expandable.create && (
            <IconButton onClick={() => expandable.create(item)}>
              <Icon color="primary">add_box</Icon>
            </IconButton>
          )}
          {children && children.length > 0 && (
            <ExpandButton
              expanded={item.expanded}
              handleClick={() => toggleExpansion(item.id)} 
            />
          )}
        </Fragment>
      );
    }
    /************************/

    const hasParticularAction = (view || edit || deleteAction || expandActions);

    const rowContent = (
      <Fragment>
        {columns.map((col, j) => (
          <TableCell
            numeric={col.numeric || false}
            colSpan={col.span || 1}
            padding={j===0 ? "none" : "default"}
            className={col.alignCenter && "text-center"}
            style={col.styles && col.styles(item)}>
            <OverflowTooltip>
              {(col.view || (col.uri && col.uri(item))) ?
                <Link to={col.view ? view && view(item, this.props) : col.uri(item)}>{col.render(item, col, this.props)}</Link>
                : col.render(item, col, this.props)
              }
            </OverflowTooltip>
          </TableCell>
        ))} 
        {hasParticularAction && (
          <TableCell style={{width: 200}} className="text-right">
            {edit && (
              <Tooltip id="edit.inline" enterDelay={500} title={'edit.inline'} placement="top">
                {/* TODO: i18n.translate(..) */}
                <IconButton onClick={() => toggle(item.id)}>
                  <Icon>edit</Icon>
                </IconButton>
              </Tooltip>
            )}
            {view && (
              <Link to={view(item, this.props)}>
                <Tooltip id="view.detail" enterDelay={500} title={'view.detail'} placement="top">
                  {/* TODO: i18n.translate(..) */}
                  <IconButton>
                    <Icon>pageview</Icon>
                  </IconButton>
                </Tooltip>
              </Link>
            )}
            {deleteAction && (
              <Tooltip id="delete" enterDelay={500} title={'edit.delete'} placement="top">
                {/* TODO: i18n.translate(..) */}
                <IconButton onClick={() => deleteAction(item.id, item)}>
                  <Icon>delete</Icon>
                </IconButton>
              </Tooltip>
            )}
            {expandActions}
          </TableCell>
        )}
      </Fragment>
    );

    // todo: uncomment once bug with CRA solved
    /*if (draggable) {
      const { move, drop } = draggable;
      const DraggableRow = withDraggable(TableRow)(rowContent);
      return <DraggableRow key={item.id} idx={i} {...item} onMove={move} onDrop={drop} />;
    }*/

    const row = <TableRow key={i} style={config && config.rowStyles && config.rowStyles(item)}>{rowContent}</TableRow>

    if (children && item.expanded) {
      let key = item.id;
      if (parentKey) key = `${parentKey}-${key}`;
      const actions = this.assembleActions(expandable, children, key);
      return (
        <Fragment>
          {row}
          <ExpandedRow
            columns={this.renderCols(expandable.columns, actions, expandable.expandable)}>
            {this.renderRows(children, expandable.columns, actions, expandable.expandable, key)}
          </ExpandedRow>
        </Fragment>
      );
    }

    return row;
  }

  renderRows = (values=[], columns, actions={}, expandable, parentKey=null) => {
    const { view, edit: editFn, update, toggleEdit, create, toggleAdd, deleteAction, onChangeAdd, onChangeEdit } = actions;
    const { updateLoading, updatables, insertables } = this.props;

    values = values.map((item, i) => {
      let edit = editFn;
      let key = item.id;
      if (parentKey) key = `${parentKey}-${key}`;

      const editing = updatables && updatables[key];
      if (typeof editFn === 'function') edit = editFn(item);
      const adding = insertables && insertables[key];
      const toggle = adding ? toggleAdd : toggleEdit;

      if (editing || adding) {
        if (updateLoading) return (
          <TableRow key={i}>
            <TableCell colSpan={columns.length+1}><Loader radius="24" /></TableCell>
          </TableRow>
        );
        else {
          const data = editing ? editing.data : adding.data;
          const onChange = adding ? onChangeAdd : onChangeEdit;
          const actions = {
            save: adding ? create : update,
            cancel: toggle,
            deleteAction
          };
          return this.renderRowForm(data, onChange, actions, columns, i);
        }
      } else return this.renderRow(item, {view, edit, deleteAction, toggle}, expandable, columns, parentKey, i);
    });

    if (create) {
      // NOTE: if create => addButton
      // TODO: this.props.add, then this.props.toggleAdd(id)
      return values.concat((
        <TableRow key={values.length+1}>
          {columns.map(() => <TableCell />).concat([
            <TableCell style={{textAlign: 'right'}}>
              {/* TODO: i18n.translate(..) */}
              <Button onClick={() => this.props.add(parentKey)} label={'add'} primary flat />
            </TableCell>
          ])}
        </TableRow>
      ));
    } else return values;
  }
 
  render() {
    const {
      config,
      values,
      filters,
      pagination,
      withoutHeader,
      handleChangePage,
      handleChangeRowsPerPage
    } = this.props;

    if (filters && Utils.ds.isEmpty(Utils.ds.removeProps(filters, ['search', 'status'])) && values.length === 0) {
      return (
        <div className="top-30">
          {/* TODO: i18n.translate(..) */}
          <Alert color="warning">{'noNumRow'}</Alert>
        </div>
      );
    }

    const columns = this.props.columns.filter(item => !item.condition || item.condition(this.props));

    const actions = config && this.assembleActions(config, values);
    const expandable = config && config.expandable;

    let { view, edit, deleteAction } = actions;
    const hasAction = (view || edit || deleteAction || expandable);

    return (
      <Table style={{tableLayout: 'fixed'}}>
        {!withoutHeader && <TableHead><TableRow>{this.renderCols(columns, actions, expandable, hasAction)}</TableRow></TableHead>}
        <TableBody>{this.renderRows(values, columns, actions, expandable)}</TableBody>
        {pagination &&
          <TableFooter>
            <TableRow>
              <TablePagination
                style={{paddingRight: 15}}
                colSpan={hasAction ? columns.length+1 : columns.length}
                {...pagination}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        }
      </Table>
    );
  }
}

MuiTable.propTypes = {
  columns: PropTypes.array.isRequired,
  sorting: PropTypes.array.isRequired
}

export default (MuiTable); // todo: withDragDropContext (i.e. CRA bug)