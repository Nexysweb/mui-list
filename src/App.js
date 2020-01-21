import React from 'react';
import './App.css';


import List from './lib/list';


function App() {
  const data = [];

  const columns = [];

  const config = {
    view: r => '/test',
    update: (id, r) => {},
    delete: (id, r) => this.props.delete(r.certId, id),
    edit: true,
    search: true,
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