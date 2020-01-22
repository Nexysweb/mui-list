import React from 'react';

import List from 'lib/list';

// data taken from 
import  data from 'world-countries';

export default () => {
  const columns = [
    {name: 'name', label: 'Name', render: x => {
    return <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(x.name.common)}`}>{x.name.common}</a>
    }},
    {name: 'capital', label: 'Capital', render: x => x.capital || ''},
    {name: 'currency', label: 'Currency', render: x => {
      const keys = Object.keys(x.currencies);

      if (!keys || keys.length === 0) {
        return '-';
      }

      const k = keys[0]
      return `${x.currencies[k].name} (${k})`
    }},
    //{name: 'iso2', label: 'ISO2', render: x => x.cca2},
    //{name: 'iso3', label: 'ISO3', render: x => x.cca3},
  ];

  const config = {};

  return (<><h2>Sorting examples</h2><List
      values={data}
      columns={columns}
      config={config}
    /></>
  );
}
