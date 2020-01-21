import React from 'react';

import { Router, Switch, Route } from 'react-router-dom';
import * as History from 'history';

import App from './App';
import Public from './public';
import Layout from './layout';

const history = History.createBrowserHistory({
  basename: process.env.PUBLIC_URL || '',
});

export default () => {
 
    return (
      <Router history={history}>
      <Layout>
        

          <Switch>
            <Route exact path="/table" component={() => <App/>}/>
            <Route component={() => <Public/>}/>
          </Switch>


      </Layout>
      </Router>
    );
  
}