import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import ibiblioLogo from '../../assets/ibiblogo.png';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './Login.css'

const navStyle = {
    "textDecoration": "none",
}

export default class Login extends React.Component {
    constructor(props) {
        super();
        this.state = {
            username: "",
            password: "",
            toHome  : false
        }
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleLogin    = this.handleLogin.bind(this);
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

    handleLogin = async () => {
        // Retrieving the user's token.
        var response = await axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/rest-auth/login/', 
            data: {
                "username": this.state.username,
                "password": this.state.password
            }
        });

        this.props.setUser(response.data.key);
        this.setState({
            toHome: true
        });
    }

    render() {
        return (
            <>
            {this.state.toHome ? <Redirect to="/home" /> : null}
    
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
                        onChange={this.handleUsername}
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
                        onChange={this.handlePassword}
                        />
                    </div>
                </div>
    
                <div className="buttonContainer">
                    <Button variant="contained" color="primary" className="loginBtn" onClick={this.handleLogin}>
                        Login
                    </Button>
                    <Link to="" style={navStyle}>
                        <Button variant="contained" color="default" className="forgotPasswordBtn">
                            Forgot Password
                        </Button>
                    </Link>
                </div>
            </div>
    
            </>
        );
    }
}