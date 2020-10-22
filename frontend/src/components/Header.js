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
        this.state = {
            userTitle: ""
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    // Logs the user out.
    async handleLogout(event) {
        localStorage.clear();
    }

    // Setting the user title and header rendering.
    async componentDidMount() {
        var userTitle = this.props.userTitle === "STATION_USER" ? "Radio user" : "Admin";
        this.setState({
            userTitle: userTitle
        })
    }

    render() {
        var userTitle = localStorage.getItem('userTitle');
        return (
            <div className="headerContainer">
                <img src={ibiblioLogo} alt="Ibiblio" className="imageContainer"/>
    
                <nav className="navBarContainer">
                    <Link to="/home" style={navStyle}> Home </Link>
                    { (userTitle !== "Radio User" && <Link to="/Approvals" style={navStyle}> Approvals </Link>) || null }
                    <Link to="/profile" style={navStyle}> Profile </Link>
                </nav>
    
                <div className="greetingsContainer">
                    Hi {userTitle}!
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