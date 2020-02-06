import Utils from '@nexys/utils';

export const compare = (main, search, d) => {
  const mainType = typeof main;
  const searchType = typeof search;

  if (searchType === 'string') {
    // here casting the `main` so that it can match with the search even if not of the same type  
    switch (mainType) {
      case 'string':
        return compareString(main, search);
      case 'number':
        return main === Number(search);
      default:
        return false;
    }
  }

  if (searchType === 'object') {
    if (search.value.length === 0) {
      return true;
    }
  
    return search.func(d, search.value)
  }

  return false;
}

export const compareString = (main, searchString) => main.toLowerCase().indexOf(searchString.toLowerCase()) > -1;

// this is a hack that will work for nested objects... leaving like this until better option
export const searchInObject = (searchString, object) => JSON.stringify(object).toLowerCase().includes(searchString.toLowerCase())  
 
// same as above but only works with linear object, the rsult will be more precise though
export const searchInObjectLinear =  (searchString, object) => Object.keys(object).map(o => {
  const main = object[o]

  return compare(main, searchString);
})
.reduce((a, b) => a || b);

export const applyFilter = (data, filters) => {
  const filterArray = Object.keys(filters).map(f => {
    return {name: f, value: filters[f]}
  });

  if (filterArray.length === 0) {
    return data;
  }

  return data.filter(d => {
    return filterArray.map(f => {
      const searchString = f.value;
      const key = f.name;
      const main = Utils.ds.get(key, d);

      if (key === 'globalSearch') {
        return searchInObject(searchString, d)
      }

      if (main === null) {
        return true;
      }

      return compare(main, searchString, d);
    })
    .reduce((a, b) => a && b);
  });
}

export const addRemoveToArray = (v, a = []) => {
  if(!a) {
    return [v]
  }

  if (a.includes(v)) {
    const idx = a.indexOf(v);
    a.splice(idx, 1)

    return a;
  }

  a.push(v);

  return a;
}