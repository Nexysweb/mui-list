import Utils from '@nexys/utils';

export const filter = (values, filters) => {
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
      console.log(filter, filter.active);
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

export const sort = (values, sorting) => {
  if (sorting) {
    const { order, orderBy } = sorting;
    return Utils.ds.sortByProp(values, orderBy, order === 'asc'); 
  }

  return values;
}

export const page = (values, pagination) => {
  if (pagination) {
    const { page, rowsPerPage } = pagination;
    return values.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }

  return values;
}

export const getPagination = (pagination) => {
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

export const getSorting = (sorting) => {
  if (!sorting) {
    return null;
  }

  const { order, orderBy } = sorting;
  return {
    order: order || 'asc',
    orderBy
  };
}

export const getValues = (values, expandable) => {
  // account for Expandables
  if (expandable) {
    const { mapping } = expandable;
    if (mapping) {
      return mapping(values);
    }
  }

  return values;
}