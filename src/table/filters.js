import React from 'react';

import List from 'lib/list';

// data taken from 
import  data from 'world-countries';

export default () => {
  const columns = [
    {name: 'name', title: 'Name', render: x => {
    return <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(x.name.common)}`}>{x.name.common}</a>
    }},
    {
      title: 'Capital',
      render: x => x.capital || '',
      filterName: 'capital',
      filterType: 'single',
      filters: [{value: 'Brussels', text: 'Belgium'}, {value: 'Vienna', text: 'Austria'}, {value: 3, text: 'Germany'}]
    },
    {
      name: 'currency',
      title: 'Currency',
      render: x => {
        const keys = Object.keys(x.currencies);

        if (!keys || keys.length === 0) {
          return '-';
        }

        const k = keys[0]
        return `${x.currencies[k].name} (${k})`
      }
    }
  ];

  const myFilters = {
    capital: []
  }

  const config = {};

  return (<><h2>Filter example</h2><List
      data={data}
      columns={columns}
      config={config}
      search
      filters={myFilters}
    /></>
  );
}
