import NexysUtil from '@nexys/utils';
const { get } = NexysUtil.ds;

/** Check if value is in the array of filter values (in case filter is a list of checkboxes) */
export const compareWithFilterArray = (arr, value) => {
  if (arr.some(isNaN)) {
    return arr.map(x => x.toLowerCase()).includes(value.toLowerCase());
  }
  return arr.includes(value);
}

export const compare = (main, searchString) => {
  const searchType = typeof main;

  switch (searchType) {
    case 'string':
      return compareString(main, searchString);
    case 'number':
      return main === Number(searchString);
    default:
      return false;
  }
}

export const compareString = (main, searchString) => main.toLowerCase().indexOf(searchString.toLowerCase()) > -1;

export const searchInObject = (searchString, object) => Object.keys(object).map(o => {
  const main = object[o];

  return compare(main, searchString);
})
.reduce((a, b) => a || b);

export const applyFilter = (data, filters) => {
  console.log(filters)
   filters = {capital: 'Vienna'}

  const filterArray = Object.keys(filters).map(f => {
    const r = {name: f, value: filters[f]}
    console.log(r)
    return r;
  });

  if (filterArray.length === 0) {
    return data;
  }

  return data.filter(d => {
    return filterArray.map(f => {
      const searchValue = f.value;

      if (typeof searchValue === 'string' && searchValue === '') {
        console.log('here')
        return data;
      }

      if (typeof searchValue === 'object' && searchValue.length === 0) {
        return data;
      }

      const key = f.name;

      const main = get(key, d);

      if (Array.isArray(searchValue)) {
        return compareWithFilterArray(searchValue, main);
      }

      if (key === 'globalSearch') {
        return searchInObject(searchValue, d);
      }

      if (main === null) {
        return true;
      }

      return compare(main, searchValue);
    })
    .reduce((a, b) => a && b);
  });
}