import NexysUtil from '@nexys/utils';
const { get } = NexysUtil.ds;

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
    return search.func(d, search)
  }

  return false;
}

export const compareString = (main, searchString) => main.toLowerCase().indexOf(searchString.toLowerCase()) > -1;

// this is a hack that will work for nested objects... leaving like this until better option
export const searchInObject = (searchString, object) => JSON.stringify(object).toLowerCase().includes(searchString.toLowerCase())  
 
// same as above but only works with linear object, the rsult will be more precise though
const searchInObjectLinear =  (searchString, object) => Object.keys(object).map(o => {
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
      const main = get(key, d);

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