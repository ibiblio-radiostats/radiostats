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

export default function Header() {
    return (
        <div className="headerContainer">
            <img src={ibiblioLogo} alt="Ibiblio" className="imageContainer"/>

            <nav className="navBarContainer">
                <Link to="/home" style={navStyle}> Home </Link>
                <Link to="/Approvals" style={navStyle}> Approvals </Link>
                <Link to="/profile" style={navStyle}> Profile </Link>
            </nav>

            <div className="greetingsContainer">
                Hi Admin!
            </div>

            <div className="logoutBtnContainer">
                <Link to="/login" style={navStyle}>
                    <Button id="logoutBtn"> Logout </Button>
                </Link>
            </div>
        </div>
    );
}