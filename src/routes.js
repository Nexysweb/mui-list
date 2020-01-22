import React from 'react';

import { Router, Switch, Route } from 'react-router-dom';
import * as History from 'history';

import Public from './public';
import Layout from './layout';
import { list } from './table';

const history = History.createBrowserHistory({
  basename: process.env.PUBLIC_URL || '',
});

export default () => {
 
    return (
      <Router history={history}>
      <Layout>
        <Switch>
          {list.map(l =>  <Route exact path={l.path} component={() => <l.Component/>}/>)}
          <Route component={() => <Public/>}/>
        </Switch>
      </Layout>
      </Router>
    );
  
}