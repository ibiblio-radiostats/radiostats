import React from 'react';
import Header from '../../components/Header';
import TextField from '@material-ui/core/TextField';
import './Profile.css';

export default class Profile extends React.Component {
    render() {
        return (
            <div className="profilePage">
                <Header/>
                <div className="infoContainer">
                    <div className="basicInfoContainer">
                        <h2> Basic Info </h2>
                        <span className="firstNameContainer">
                            <TextField id="firstName" label="First name" />
                        </span>
                        <span className="lastNameContainer">
                            <TextField id="lastName"  label="Last name" />
                        </span>

                        <div className="emailContainer">
                            <TextField id="email"  label="Email" />
                        </div>
                    </div>
                    <div className="accountContainer">
                        <h2> Account </h2>
                        <span className="firstNameContainer">
                            <TextField id="user" label="User" />
                        </span>
                        <span className="lastNameContainer">
                            <TextField id="password"  label="Password" />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}