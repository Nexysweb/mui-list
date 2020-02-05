import React from 'react';

import {List} from 'lib/list';

// data taken from 
import  data from 'world-countries';

export default () => {
  const columns = [
    {name: 'name', title: 'Name', render: x => {
    return <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(x.name.common)}`}>{x.name.common}</a>
    }},
    {
      key: 'capital',
      name: 'capital',
      title: 'Capital',
      render: x => x.capital || '',
      sort: true
    },
    {name: 'currency', title: 'Currency', render: x => {
      const keys = Object.keys(x.currencies);

      if (!keys || keys.length === 0) {
        return '-';
      }

      const k = keys[0]
      return `${x.currencies[k].name} (${k})`
    }}
  ];

  const config = {};

  return (<><h2>Simple table example</h2><List
      data={data}
      def={columns}
      config={config}
    /></>
  );
}
