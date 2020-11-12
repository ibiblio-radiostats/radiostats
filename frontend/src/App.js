import React from 'react';
import Login from './pages/Login/Login';
import Approvals from './pages/Approval/Approvals';
import Home from './pages//Home/Home';
import Profile from'./pages/Profile/Profile';
import ChangePassword from './pages/ChangePassword/ChangePassword';

import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

export default class AppRouter extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/home" component={Home}/>
                    <Route path="/approvals" component={Approvals} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/changepassword" component={ChangePassword} />
                </Switch>
            </Router>
        );
    }
}