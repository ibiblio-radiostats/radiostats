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

export default function Header({user}) {
    const handleLogout = async () => {
        await axios.post("http://127.0.0.1:8000/rest-auth/logout/");
    }

    return (
        <div className="headerContainer">
            <img src={ibiblioLogo} alt="Ibiblio" className="imageContainer"/>

            <nav className="navBarContainer">
                <Link to="/home" style={navStyle}> Home </Link>
                { (user === "Admin" && <Link to="/Approvals" style={navStyle}> Approvals </Link>) || null }
                <Link to="/profile" style={navStyle}> Profile </Link>
            </nav>

            <div className="greetingsContainer">
                Hi!
            </div>

            <div className="logoutBtnContainer">
                <Link to="/login" style={navStyle}>
                    <Button id="logoutBtn" onClick={handleLogout}> Logout </Button>
                </Link>
            </div>
        </div>
    );
}