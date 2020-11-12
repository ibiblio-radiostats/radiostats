import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import './Profile.css';
import { Button } from '@material-ui/core';

const navStyle = {
    "textDecoration": "none",
}

export default function Profile() {
    const userTitle = localStorage.getItem("userTitle");
    const [edit, setEdit] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");

    useEffect(() => {
        async function fetchData() {
            // Setting basic information.
            var user = localStorage.getItem("user");
            await axios({
                url: `${window._env_.BACKEND_BASE_URL}api/user/`,
                method: 'get',
                headers: {
                    Authorization: `Token ${user}`
                }
            }).then((res) => {
                setFirstName(res.data[0].first_name);
                setLastName(res.data[0].last_name);
                setEmail(res.data[0].email);
            }).catch((err) => {
                console.log(err);
            });

            // Setting user info.
            await axios({
                url:`${window._env_.BACKEND_BASE_URL}api/userinfo/`,
                method: 'get',
                headers: {
                    Authorization: `Token ${user}`
                }
            }).catch((err) => {
                console.log(err);
            })
        }
        fetchData();
    }, []);

    const handleFirstName = (event) => {
        setFirstName(event.target.value);
    }

    const handleLastName = (event) => {
        setLastName(event.target.value);
    }

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleSave = async (event) => {
        if (edit) {
            var user = localStorage.getItem("user");
            if (edit) {
                await axios({
                    url: `${window._env_.BACKEND_BASE_URL}api/user/change_userinfo/`,
                    method: 'patch',
                    headers: {
                        Authorization: `Token ${user}`
                    },
                    data: {
                        "first_name": firstName,
                        "last_name": lastName,
                        "email": email,
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
            setEdit(!edit);
        }
    }

    const handleEdit = (event) => {
        if (!edit) setEdit(!edit);
    }

    return (
        <div className="profilePage">
            <Header/>
            <div className="infoContainer">
                <div className="basicInfoContainer">
                    <h2> Basic Info <IconButton onClick={handleEdit}> <EditIcon/> </IconButton> </h2>
                    <span className="firstNameContainer">
                        <TextField id="firstName" onChange={handleFirstName} label="First name" value={firstName} disabled={!edit}/>
                    </span>
                    <span className="lastNameContainer">
                        <TextField id="lastName" onChange={handleLastName} label="Last name" value={lastName} disabled={!edit}/>
                    </span>
                    <div className="emailContainer">
                        <TextField id="email" onChange={handleEmail} label="Email" value={email} disabled={!edit}/>
                    </div>
                    <div className="saveBtnContainer">
                        {edit ? <Button variant="contained" color="primary" onClick={handleSave}> Save </Button> : null }
                    </div>
                </div>
                <div className="accountContainer">
                    <h2> Account </h2>
                    <span className="passwordContainer">
                        <TextField id="password"  label="Password" value="*********"disabled={true}/>
                    </span>
                    <span className="userContainer">
                        <TextField id="user" label="User" value={userTitle} disabled={true}/>
                    </span>
                    <div>
                        <Link to="/changepassword" style={navStyle}>
                            Change Password
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}