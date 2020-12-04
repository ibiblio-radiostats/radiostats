import React from 'react';
import Button from '@material-ui/core/Button';
import ibiblioLogo from '../assets/ibiblogo.png';
import { Link } from 'react-router-dom';
import './Header.css'

const navStyle = {
    color: 'black',
    "textDecoration": "none",
    "marginLeft": "1.5rem"
}

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    // Logs the user out.
    async handleLogout(event) {
        sessionStorage.clear();
    }

    render() {
        var userTitle = sessionStorage.getItem('userTitle');
        return (
            <div className="headerContainer">
                <img src={ibiblioLogo} alt="ibiblio" className="imageContainer"/>

                <nav className="navBarContainer">
                    <Link to="/home" style={navStyle}> Home </Link>
                    { (userTitle !== "Radio User" && <Link to="/approvals" style={navStyle}> Approvals </Link>) || null }
                    <Link to="/profile" style={navStyle}> Profile </Link>
                </nav>

                <div data-testid="greetingsContainer" className="greetingsContainer">
                    Hi {userTitle}!
                </div>

                <div className="logoutBtnContainer">
                    <Link to="/login" style={navStyle}>
                        <Button data-testid="logoutBtn" id="logoutBtn" onClick={this.handleLogout}> Logout </Button>
                    </Link>
                </div>
            </div>
        );
    }
}
