import React from 'react';
import Login from './pages/Login/Login';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import TimedPages from './TimedPages';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/login" component={Login}/>
                    <Route path="/" component={TimedPages} />
                </Switch>
                {sessionStorage.getItem('user') == null ? <Redirect to="/login" /> : null }
            </Router>
        );
    }
}