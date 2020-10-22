import React from 'react';
import Button from '@material-ui/core/Button';
import ibiblioLogo from '../assets/ibiblogo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Header.css'

const navStyle = {
    color: 'black',
    "textDecoration": "none",
    "marginLeft": "1.5rem"
}

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userTitle: ""
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    // Logs the user out.
    async handleLogout(event) {
        await axios.get("http://127.0.0.1:8000/rest-auth/logout/", {
            headers: {
                Authorization: `Token ${this.props.user}` 
            }
        });
    }

    // Setting the user title and header rendering.
    async componentDidMount() {
        var response = await axios.get("http://127.0.0.1:8000/api/users/", {
            headers: {
                Authorization: `Token ${this.props.user}` 
            }
        });

        var userTitle = response.data[0].role === "IBIBLIO_ADMIN" ? "Admin" : "Radio User";
        this.setState({
            userTitle: userTitle
        })
    }

    render() {
        return (
            <div className="headerContainer">
                <img src={ibiblioLogo} alt="Ibiblio" className="imageContainer"/>
    
                <nav className="navBarContainer">
                    <Link to="/home" style={navStyle}> Home </Link>
                    { (this.state.userTitle !== "Radio User" && <Link to="/Approvals" style={navStyle}> Approvals </Link>) || null }
                    <Link to="/profile" style={navStyle}> Profile </Link>
                </nav>
    
                <div className="greetingsContainer">
                    Hi {this.state.userTitle}!
                </div>
    
                <div className="logoutBtnContainer">
                    <Link to="/login" style={navStyle}>
                        <Button id="logoutBtn" onClick={this.handleLogout}> Logout </Button>
                    </Link>
                </div>
            </div>
        );
    }
}