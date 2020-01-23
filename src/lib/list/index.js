import React, { Component, Fragment } from 'react';
import update from 'immutability-helper';

import Icon from '@material-ui/core/Icon';

import { Loader } from '../components';
import { Wrapper, Input, OptionGroup } from '../components/form';
import { GridWrapper, GridCell } from '../components/grid';

import Table from '../table';

import Utils from '@nexys/utils';


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

    let pagination = null;
    if (config.pagination) {
      const { rowsPerPageOptions, rowsPerPage } = config.pagination;
      pagination = {
        rows: [],
        rowsPerPageOptions: rowsPerPageOptions || [10, 30, 50, 100],
        page: 0,
        rowsPerPage: rowsPerPage || 50,
        total: null
      };
    }

    let sorting = null;
    if (config.sorting) {
      const { order, orderBy } = config.sorting;
      sorting = {
        order: order || 'asc',
        orderBy
      };
    }

    let { values } = props;
    values = this.prepareExpandable(values);

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

  prepareExpandable = values => {
    const { config: { expandable } } = this.props;
    if (expandable) {
      const { mapping } = expandable;
      if (mapping) {
        return mapping(values);
      }
    }
    return values;
  }

  componentWillReceiveProps(nextProps) {
    let { values } = nextProps;
    values = this.prepareExpandable(values);
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


  /*** STATUS WIDGET ***/
  renderStatus = () => {
    const { config } = this.props;
    const { filters } = this.state;

    // TODO: work with status name?
    return (
      <OptionGroup
        name="status"
        options={config.status}
        selectedValue={filters.status.value}
        handleChange={this.handleFilterChange}
        label={'status.select'} // TODO: translation: i18n.translate('status.select')
        // selectedColor={adminColor}
        compact
        simple
        all
      />
    );
  }
  /******************/

  /*** SEARCH WIDGET ***/
  renderSearch = () => {
    const { filters } = this.state;

    // TODO
    // - debounce: https://toughcompetent.com/blog/es5-es6-debounce-react-events-on-inputs/
    // - throttle: https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
    // use: https://www.npmjs.com/package/throttle-debounce
    return (
      <Wrapper name="search" label={'filters.search'} inline>
        <Input
          value={filters.search.value}
          onChange={this.handleFilterChange}
          placeholder={'filters.search.type'} // TODO: i18n.translate(..)
          suffix={<Icon color="primary">search</Icon>}
        />
      </Wrapper>
    );
  }
  /******************/


  filter = () => {
    let { values, filters } = this.state;

    if (values) {
      const { search: searchFilter, status: statusFilter } = filters;

      if (statusFilter && statusFilter.value > 0) {
        values = values.filter(item => item.status.id === statusFilter.value);
      }

      if (searchFilter && searchFilter.value) {
        values = values.filter(item => {
          const searchValue = searchFilter.value.toLowerCase();
          // TODO: columns, search?
          return searchFilter.searchIn.some(nameItem => {
            let accessedValue = Utils.ds.get(nameItem, item);
            accessedValue = isNaN(accessedValue) ? accessedValue.toLowerCase() : String(accessedValue);
            if (accessedValue) return accessedValue.includes(searchValue);
            else return false;
          });
        });
      }

      filters = Utils.ds.removeProps(filters, ['status', 'search']);
      const filterCols = Object.keys(filters);

      filterCols.forEach(colName => {
        let filter = filters[colName];
        if (filter && filter.filterIsActive) {
          filter = Utils.ds.removeProp(filter, 'filterIsActive');
          const anySet = Object.values(filter).some(item => item);
          if (anySet) {
            // TODO: boolean vs domain
            values = values.filter(item => {
              // get column object or value from linearized key
              let colItem = Utils.ds.get(colName, item);
              if (colItem === null || colItem === undefined) colItem = Utils.ds.get(colName + "Set", item);
              // get value from column object or keep value from linearized key
              const value = typeof colItem === 'object' && colItem !== null ? colItem.name || colItem.id : colItem; 
              return filter[value];
            });
          }
        }
      });
    }

    return values;
  }
 
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
    let { config: { search, status } } = this.props;
    const { filters, sorting, pagination, updatables, insertables, updateLoading } = this.state;

    let filteredValues = this.filter();
    
    if (!filteredValues) return <Loader />;

    if (sorting) {
      const { order, orderBy } = sorting;
      filteredValues = Utils.ds.sortByProp(filteredValues, orderBy, order === 'asc'); 
    }

    let pageValues = null;
    if (pagination) {
      const { page, rowsPerPage } = pagination;
      pageValues = filteredValues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }


    return (
      <Fragment>
        {(status || search) && (
          <GridWrapper admin>
            <GridCell span2>{status && this.renderStatus()}</GridCell>
            <GridCell>{search && this.renderSearch()}</GridCell>
          </GridWrapper>
        )}
        <div style={{marginTop: 30}}>
          <Table
            {...this.props}
            updateLoading={updateLoading}
            loadingUpdate={this.loadingUpdate}
            values={pageValues || filteredValues}
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