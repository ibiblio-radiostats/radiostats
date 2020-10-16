import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import './Login.css'

// Images.
import ibiblioLogo from '../../assets/ibiblogo.png';

const navStyle = {
    "text-decoration": "none",
}

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    // Save username.
    handleUsername(event) {
        this.setState({
            username: event.target.value
        })
    }

    handlePassword(event) {
        this.setState({
            password: event.target.value
        })
    }
    
    render() {
        return (
            <div className = "loginFormContainer" alt="Ibiblio">

                <div className="title">
                    <img src={ibiblioLogo} alt="Ibiblio" style={{width: "40%", height: "30%"}}/>
                    <div className = "subtitle"> Radio Stats Billing Portal</div>
                </div>

                <div className="loginFormFieldContainer">
                    <div className="loginFormField">
                        <TextField
                        id="filled-username-input"
                        label="Username"
                        fullWidth
                        autoComplete="current-password"
                        variant="outlined"
                        />
                    </div>

                    <div className="loginFormField"> 
                        <TextField
                        id="filled-password-input"
                        label="Password"
                        type="password"
                        fullWidth
                        autoComplete="current-password"
                        variant="outlined"
                        />
                    </div>
                </div>

                <div className="buttonContainer">
                    <Link to="/home" style={navStyle}>
                        <Button variant="contained" color="primary" className="loginBtn">
                            Login
                        </Button>
                    </Link>
                    <Link to="" style={navStyle}>
                        <Button variant="contained" color="default" className="forgotPasswordBtn">
                            Forgot Password
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
}