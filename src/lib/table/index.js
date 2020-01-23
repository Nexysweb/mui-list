import React from 'react';
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

import { Menu, MenuItem, Icon, FormControlLabel, Checkbox } from '@material-ui/core';

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


const MuiTable = props => {
  const {
    applyFilter,
    config,
    values,
    errors,
    filters,
    pagination,
    withoutHeader,
    handleChangePage,
    handleChangeRowsPerPage,
    updateLoading, updatables, insertables,
    sorting,
    toggleExpansion, toggleEdit, toggleAdd,
    handleEdit, handleAdd, remove
  } = props;

  const createSortHandler = colName => e => props.onSort(colName);

  //const openFilterMenu = anchorName => event => this.setState({[anchorName]: event.currentTarget});
  const closeFilterMenu = anchorName => e => null; // to rework this.setState({[anchorName]: null});

  const handleFilter = (e, checked, item, colName) => props.onFilterChange(checked, item, colName);

  const submitFilter = colName => {
    
    const closeFilter = closeFilterMenu(colName);
    closeFilter();
    applyFilter(colName);
  }

  const resetFilter = colName => {
    const closeFilter = closeFilterMenu(colName);
    closeFilter();
    resetFilter(colName);
  }

  const renderFilter = col => {

    const colFilters = filters[col.name];

    const anchorName = col.name;
    const anchorEl = this.state[anchorName];

    // TODO: refactor filters
    let columnFilters = col.table && col.table.filters;
    if (!Array.isArray(columnFilters)) columnFilters = props[columnFilters];

    return (
      <SubMenu
        id="filter-menu"
        anchorEl={anchorEl}
        onClose={closeFilterMenu(anchorName)}
        open={Boolean(anchorEl)}>
        {columnFilters.map(item => (
          <MenuItem onClick={() => {}} style={{paddingLeft: 15}}>
            <FormControlLabel
              control={
                <Checkbox
                  name={item.name}
                  color="primary"
                  checked={colFilters && colFilters[item.value || item.name]}
                  onChange={(e, checked) => handleFilter(e, checked, item, col.name)}
                />
              }
              label={item.label || item.name}
            />
          </MenuItem>
        ))}
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          {/* TODO: i18n.translate */}
          <Button onClick={() => submitFilter(col.name)} label={'submit'} primary flat />
          <Button onClick={() => resetFilter(col.name)} label={'reset'} primary flat />
        </div>
      </SubMenu>
    );
  }

  // TODO: hiddenColumns
  const renderCols = (columns, actions={}, expandable, hasAction) => {
    hasAction = hasAction || expandable;

    let { create } = actions;

    columns = columns.map((col, id) => {
      const value = col.renderHead ? col.renderHead(col) : col.label; // i18n.translate(col.label) 
      const nextSortOrder = (sorting && sorting.order === 'asc' ? 'desc' : 'asc') || 'desc';

      // NOTE: column filter
      let columnFilters = col.table && col.table.filters;
      if (!Array.isArray(columnFilters)) columnFilters = props[columnFilters];

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
                onClick={createSortHandler(col.name)}>
                {value}
              </TableSortLabel>
            </Tooltip> : value
          }
          {columnFilters && (
            <>
              <Tooltip
                id={`${col.name}-filter-tooltip`}
                title={'filter.info'} // TODO: i18n.translate(..)
                placement="top"
                enterDelay={300}>
                <IconButton
                  style={{fontSize: 16}}
                  > 
                  {/*{/* onClick={openFilterMenu(col.name)}*/}
                  <Icon style={{fontSize: 16}}>filter_list</Icon>
                </IconButton>
              </Tooltip>
              {renderFilter(col)}
            </>
          )}
        </TableCell>
      );
    });

    if (hasAction) {
      let col = <TableCell style={{width: 200}} />;
      if (create) {
        col = (
          <TableCell style={{width: 200, textAlign: 'right'}}>
            <IconButton onClick={e => props.add()}>
              <Icon color="primary">add_box</Icon>
            </IconButton> 
          </TableCell>
        );
      }
      columns = columns.concat([col]);
    }
    
    return columns;
  }
  
  const renderFormElem = (editable, col, item, handleChange) => {

    const name = (editable && editable.name) || col.name;
    const value = Utils.ds.get(name, item);

    if (editable.render) {
      return editable.render(name, value, item, props);
    }

    const defaultValue = Utils.ds.get(editable.defaultName || name, item);
    switch (editable.type) {
      case 'select': {
        return (
          <Wrapper name={name} errors={errors} inline>
            <Select
              value={value || defaultValue}
              values={props[editable.values]}
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
  const submit = (e, handleSubmit, handleEscape) => {
    if (e.key) {
      if (e.key === 'Enter' && !e.shiftKey) {
        props.loadingUpdate();
        handleEscape();
      }
      handleSubmit(e);
    } else {
      props.loadingUpdate();
      handleEscape();
      handleSubmit(e);
    }
  }

  const renderRowForm = (data, onChange, {save, cancel, deleteAction}, columns, i) => {
    // TODO: show loader inside row while update takes place
    const RowForm = withForm(({data, handleChange, handleSubmit, handleSubmitKey, handleEscape}) => (
      <TableRow key={i} onKeyUp={e => submit(e, handleSubmitKey, handleEscape)}>
        {columns.map((col, j) => (
          <TableCell
            padding={j===0 ? "none" : 'default'}
            numeric={col.numeric || false}
            className={col.alignCenter && "text-center"}>
            {col.editable ? (
              renderFormElem(col.editable, col, data, handleChange)
            ) : (
              <OverflowTooltip>{col.render(data, col, props)}</OverflowTooltip>
            )}
          </TableCell>
        ))} 
        <TableCell style={{width: 200, textAlign: 'right'}}>
          {/* TODO: i18n.translate(..) */}
          <Tooltip id="edit.save" enterDelay={500} title={'save'} placement="top">
            <IconButton onClick={e => submit(e, handleSubmit, handleEscape)}>
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
        {...props}
        data={data}
        handleChange={onChange(data.id)}
        update={save}
        cancel={cancel}
        inline
      />
    );
  }

  const assembleActions = (config={}, values, key) => {
    const { view=false, edit=false, update=false, create=false } = config;

    return {
      view,
      edit,
      toggleEdit: edit ? toggleEdit(values, key): null,
      update,
      toggleAdd: create ? toggleAdd(values, key): null,
      create,
      deleteAction: create ? remove(key): null,
      onChangeEdit: edit ? handleEdit(key) : false,
      onChangeAdd: create ? handleAdd(key): false
    };
  }

  const renderRow = (item, actions, expandable, columns, parentKey, i) => {
    let { view, edit, deleteAction, toggle } = actions;
    // todo , draggable

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
        <>
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
        </>
      );
    }
    /************************/

    const hasParticularAction = (view || edit || deleteAction || expandActions);

    const rowContent = (
      <>
        {columns.map((col, j) => (
          <TableCell
            numeric={col.numeric || false}
            colSpan={col.span || 1}
            padding={j===0 ? "none" : "default"}
            className={col.alignCenter && "text-center"}
            style={col.styles && col.styles(item)}>
            <OverflowTooltip>
              {(col.view || (col.uri && col.uri(item))) ?
                <Link to={col.view ? view && view(item, props) : col.uri(item)}>{col.render(item, col, props)}</Link>
                : col.render(item, col, props)
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
              <Link to={view(item, props)}>
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
      </>
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
      const actions = assembleActions(expandable, children, key);
      return (
        <>
          {row}
          <ExpandedRow
            columns={renderCols(expandable.columns, actions, expandable.expandable)}>
            {renderRows(children, expandable.columns, actions, expandable.expandable, key)}
          </ExpandedRow>
        </>
      );
    }

    return row;
  }

  const renderRows = (values=[], columns, actions={}, expandable, parentKey=null) => {
    const { view, edit: editFn, update, toggleEdit, create, toggleAdd, deleteAction, onChangeAdd, onChangeEdit } = actions;
    

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
          return renderRowForm(data, onChange, actions, columns, i);
        }
      } else return renderRow(item, {view, edit, deleteAction, toggle}, expandable, columns, parentKey, i);
    });

    if (create) {
      // NOTE: if create => addButton
      // TODO: this.props.add, then this.props.toggleAdd(id)
      return values.concat((
        <TableRow key={values.length+1}>
          {columns.map(() => <TableCell />).concat([
            <TableCell style={{textAlign: 'right'}}>
              {/* TODO: i18n.translate(..) */}
              <Button onClick={() => props.add(parentKey)} label={'add'} primary flat />
            </TableCell>
          ])}
        </TableRow>
      ));
    } else return values;
  }

  if (filters && Utils.ds.isEmpty(Utils.ds.removeProps(filters, ['search', 'status'])) && values.length === 0) {
    return (
      <div className="top-30">
        {/* TODO: i18n.translate(..) */}
        <Alert color="warning">{'noNumRow'}</Alert>
      </div>
    );
  }

  const columns = props.columns.filter(item => !item.condition || item.condition(props));
  const actions = config && assembleActions(config, values);
  const expandable = config && config.expandable;
  let { view, edit, deleteAction } = actions;
  const hasAction = (view || edit || deleteAction || expandable);
 
  return (
    <Table style={{tableLayout: 'fixed'}}>
      {!withoutHeader && <TableHead><TableRow>{renderCols(columns, actions, expandable, hasAction)}</TableRow></TableHead>}
      <TableBody>{renderRows(values, columns, actions, expandable)}</TableBody>
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

MuiTable.propTypes = {
  columns: PropTypes.array.isRequired,
  sorting: PropTypes.array.isRequired
}

export default (MuiTable); // todo: withDragDropContext (i.e. CRA bug)