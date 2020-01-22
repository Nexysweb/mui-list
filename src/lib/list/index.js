import React, { Component, Fragment } from 'react';
import update from 'immutability-helper';

import { Loader } from '../components';

import { GridWrapper, GridCell } from '../components/grid';

import Table from '../table';


import Utils from '@nexys/utils';

import * as ListUtils from './utils';
import Search from './search';
import Status from './status';

const getPagination = (pagination) => {
  if (!pagination) {
    return null;
  }

  const { rowsPerPageOptions, rowsPerPage } = pagination;
  return {
    rows: [],
    rowsPerPageOptions: rowsPerPageOptions || [10, 30, 50, 100],
    page: 0,
    rowsPerPage: rowsPerPage || 50,
    total: null
  };
}

const getSorting = (sorting) => {
  if (!sorting) {
    return null;
  }

  const { order, orderBy } = sorting;
  return {
    order: order || 'asc',
    orderBy
  };
}

const getValues = (values, expandable) => {
  // account for Expandables
  if (expandable) {
    const { mapping } = expandable;
    if (mapping) {
      return mapping(values);
    }
  }

  return values;
}

class List extends Component {
  constructor(props) {
    super(props);

    const { columns, config } = props;

    if (config.draggable) {
      this.draggable = {
        ...config.draggable,
        move: this.move,
        drop: this.drop
      };
    };

    const searchIn = columns.filter(item => item.table && item.table.search).map(item => item.name);

    const pagination = getPagination(config.pagination);
    const sorting = getSorting(config.sorting);
    const values = getValues(props.values, props.config.expandable);

    this.state = {
      values,
      addRows: [],
      filters: {
        status: { value: 0 },
        search: {
          searchIn
        }
      },
      updatables: {},
      insertables: {},
      pagination,
      sorting
    };
  }

  componentWillReceiveProps(nextProps) {
    const values =  getValues(nextProps.values, this.props.config.expandable);
    this.setState({values, updateLoading: false});
  }

  loadingUpdate = () => this.setState({updateLoading: true});

  // Utils.debounce(call, 250);
  handleFilterChange = ({name, value}) => {
    this.setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [name]: {
          ...prevState.filters[name],
          value
        }
      }
    }))
  };


  /*** COLUMN FILTERS ***/
  handleColumnFilter = (checked, {id, name}, colName) => {
    // TODO: support greater & less than
    // TODO: handle & activate every filter value separately
    this.setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [colName]: {
          ...prevState.filters[colName],
          [name]: checked,
          [id]: checked
        }
      }
    }));
  }

  applyColumnFilter = colName => {
    this.setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [colName]: {
          ...prevState.filters[colName],
          filterIsActive: true
        }
      }
    }));
  }

  resetColumnFilter = colName => {
    this.setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [colName]: {}
      }
    }));
  }
  /******************/


  /*** SORTING ***/
  handleSort = colName => {
    const { sorting } = this.state;

    let order = 'desc';
    if (sorting && sorting.orderBy === colName) {
      order = sorting.order === 'asc' ? 'desc' : 'asc';
    }

    this.setState(prevState => ({
      ...prevState,
      sorting: {
        orderBy: colName,
        order
      }
    }));
  }
  /******************/


  /*** PAGINATION ***/
  handleChangePage = (event, page) => this.setState(prevState => ({
    ...prevState,
    pagination: {
      ...prevState.pagination,
      page
    }
  }));

  handleChangeRowsPerPage = event => this.setState(prevState => ({...prevState, pagination: {...prevState.pagination, rowsPerPage: event.target.value }}));
  /******************/


  /*** DRAG & DROP ***/
  move = (dragId, hoverId) => {
    if (dragId !== undefined && hoverId !== undefined) {
      const { values } = this.state;

      const dragItem = values.find(e => e.id === dragId);
      const dragIdx = values.findIndex(e => e.id === dragId);
      const hoverIdx = values.findIndex(e => e.id === hoverId);

      const newValues = update(values, {
        $splice: [[dragIdx, 1], [hoverIdx, 0, dragItem]]
      });
      /***
       * {$splice: array of arrays} for each item in arrays call splice() on the target with the parameters provided by the item.
       * Note: The items in the array are applied sequentially, so the order matters. The indices of the target may change during the operation.
       **/

      this.setState({values: newValues});
    }
  }

  drop = async (draggedId, id) => {
    if (this.draggable.handler) {
      // pass async list fetcher as callback?
      this.draggable.handler(draggedId, id);
      /*
        if (uriPrefix && fetchList) {
          const uri = `${uriPrefix}/move/${draggedId}/${id}`;
          // TODO: migrate
          const result = await HTTPClient.get(uri);
          if (result.status === 200) fetchList();
        }
      */
    } else {
      console.warn('No draggable move handler specified')
    }
  }
  /*******************/


 
  /******************/

  


  
 
  toggle = (storeKey, values, prefix=null) => id => {
    let key = id;
    if (prefix) key = `${prefix}-${id}`;
    if (key in this.state[storeKey]) {
      this.setState(prevState => {
        const store = prevState[storeKey];
        delete store[key];
        return {
          ...prevState,
          [storeKey]: store
        };
      });
    } else {
      const data = values.find(item => item.id === id);
      this.setState(prevState => ({
        ...prevState,
        [storeKey]: {
          ...prevState[storeKey],
          [key]: {
            data: {...data},
            errors: {}
          }
        }
      }));
    }
  }

  toggleEdit = (values, depth=null) => id => {
    this.toggle('updatables', values, depth)(id);
  }

  toggleAdd = (values, depth=null) => id => {
    this.toggle('insertables', values, depth)(id);
  }

  handleChange = (store, id, prefix) => change => {
    const key = prefix ? `${prefix}-${id}` : id;
    const item = this.state[store][key];

    const data = Utils.ds.updateObject(item.data, change);
    this.setState(prevState => ({
      ...prevState,
      [store]: {
        ...prevState[store],
        [key]: {
          ...item,
          data
        }
      }
    }));
  }

  // TODO: depth isn't exclusive for nested ids that are similar
  handleEdit = (depth=null) => id => change => {
    this.handleChange('updatables', id, depth)(change);
  }

  handleAdd = (depth=null) => id => change => {
    this.handleChange('insertables', id, depth)(change);
  }

  /*
    TODO:
    handleDelete = delete => id => {
      call delete (without fetch)
      & remove from values
    }
  */

  // TODO: handle nesting
  add = (key=null) => {
    // keyComps = key.split('_');
    if (!key) {
      // TODO: robust id
      const id = Math.max(...this.state.values.map(item => item.id))+1;
      this.setState(prevState => ({
        ...prevState,
        values: [
          ...prevState.values,
          { add: true, id }
        ]
      }), () => this.toggleAdd(this.state.values, key)(id));
    } 

    console.log('add');
    //else {
      // let { config: { expandable } } = this.props;
      // need all the ids
    //}
  }

  remove = (key=null) => id => {
    // if key => key.split();
    if (!key) {
      this.setState(prevState => ({
        ...prevState,
        values: prevState.values.filter(item => item.id !== id)
      }));
    }
  }

  render() {
    const { config } = this.props;

    const { values, filters, sorting, pagination, updatables, insertables, updateLoading } = this.state;

    const filteredValues = ListUtils.filter(values, filters);
    
    // what does this mean ?
    if (!filteredValues) return <Loader />;

    const sortedValues = ListUtils.sort(filteredValues, sorting);
    const pagedValues = ListUtils.page(sortedValues, pagination);

    return (
      <Fragment>
        {(config.status || config.search) && (
          <GridWrapper admin>
            <GridCell span2>{config.status && <Status status={config.status} filters={filters} onChange={this.handleFilterChange}/>}</GridCell>
            <GridCell>{config.search && <Search filters={filters} onChange={this.handleFilterChange}/>}</GridCell>
          </GridWrapper>
        )}
        <div style={{marginTop: 30}}>
          <Table
            {...this.props}
            updateLoading={updateLoading}
            loadingUpdate={this.loadingUpdate}
            values={pagedValues}
            handleEdit={this.handleEdit}
            handleAdd={this.handleAdd}
            filters={filters}
            applyFilter={this.applyColumnFilter}
            resetFilter={this.resetColumnFilter}
            onFilterChange={this.handleColumnFilter}
            sorting={sorting}
            onSort={this.handleSort}
            pagination={pagination && {...pagination, count: filteredValues.length}}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
            draggable={this.draggable}
            updatables={updatables}
            insertables={insertables}
            toggleEdit={this.toggleEdit}
            toggleAdd={this.toggleAdd}
            add={this.add}
            remove={this.remove}
          />
        </div>
      </Fragment>
    );
  }
}

export default List;