import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Page imports.
import Login from './pages/Login/Login';
import Approvals from './pages/ApprovalPage/Approvals';
import Home from './pages//Home/Home';
import Profile from'./pages/Profile/Profile';

// React router imports.
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

ReactDOM.render(
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/approvals" component={Approvals} />
        <Route path="/profile" component={Profile} />
      </Switch>
    </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
