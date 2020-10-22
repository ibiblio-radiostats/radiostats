import React from 'react';
import Login from './pages/Login/Login';
import Approvals from './pages/Approval/Approvals';
import Home from './pages//Home/Home';
import Profile from'./pages/Profile/Profile';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

export default class AppRouter extends React.Component {
    constructor() {
        super();
        this.state = {
            user: ""
        };
        this.handleNewUser = this.handleNewUser.bind(this);
    }

    handleNewUser(newUser) {
        this.setState({
            user: newUser
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={(props) => (
                        <Login {...props} setUser={this.handleNewUser} />
                    )} />
                    <Route path="/login" render={(props) => (
                        <Login {...props} setUser={this.handleNewUser} />
                    )} />
                    <Route path="/home" render={(props) => (
                        <Home {...props} user={this.state.user} />
                    )} />
                    <Route path="/approvals" render={(props) => (
                        <Approvals {...props} user={this.state.user} />
                    )} />
                    <Route path="/profile" render={(props) => (
                        <Profile {...props} user={this.state.user} />
                    )} />
                </Switch>
            </Router>
        );
    }
}