import React from 'react';
import Login from './pages/Login/Login';
import Approvals from './pages/Approval/Approvals';
import Home from './pages//Home/Home';
import Profile from'./pages/Profile/Profile';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import IdleTimer from 'react-idle-timer'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

export default function TimedPages() {
    const [timedOut, handleTimeOut] = React.useState(false);

    // Clearing user session.
    const handleOnIdle = (event) => {
        handleTimeOut(true);
        sessionStorage.clear();
    }

    // Resume user session.
    const handleOnAction = (event) => {
        handleTimeOut(false);
    }

    return (
        (!timedOut &&
        <>
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                onAction={handleOnAction}
                debounce={250}
            />

            <Router>
                <Switch>
                    <Route exact path="/login" component={Login}/>
                    <Route path="/home" component={Home}/>
                    <Route path="/approvals" component={Approvals} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/changepassword" component={ChangePassword} />
                </Switch>
            </Router>
        </>
        )

        ||

        <Redirect to="/login" />
    );
}

