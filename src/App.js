import React from 'react';
import './App.css';

import List from './lib/list';

function App() {
  const data = [
    {name: 'Germany'},
    {name: 'Switzerland'},
  ];

  const columns = [
    {name: 'name', render: x => x.name}
  ];

  const config = {
    //view: r => '/test',
    //update: (id, r) => {},
    //delete: (id, r) => this.props.delete(r.certId, id),
    //edit: true,
    //search: true,
  };

  return (
    <List
      values={data}
      columns={columns}
      config={config}
    />
  );
}

export default App;