import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Redirect } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Header from '../../components/Header';
import axios from 'axios';
import './ChangePassword.css';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ChangePassword() {
    const user = sessionStorage.getItem("user");
    const [toProfile, setToProfile] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [oldPassword, setOldPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const handleOldPassword = (event) => {
        setOldPassword(event.target.value);
    }

    const handleNewPassword = (event) => {
        setNewPassword(event.target.value);
    }

    const handleConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    const handleSubmit = async () => {
        await axios({
            url:`${window._env_.BACKEND_BASE_URL}api/user/change_password/`,
            method: 'put',
            headers: {
                Authorization: `Token ${user}`
            },      
            data: {
                "old_password" : oldPassword,
                "new_password1": newPassword,
                "new_password2": confirmPassword,
            }
        }).then(() => {
            setOpen(true);
            setError(false);
        })
        .catch((err) => {
            setError(true);
            console.log(err);
        })
    }

    const handleClick = () => {
        setToProfile(true);
    }

    return (
        <div>
            <Header />
            {toProfile ? <Redirect to="/profile" /> : null}

            <IconButton style={{width: "5%", height: "5%", marginLeft: "2%", marginTop:"2%", color: "black"}} onClick={handleClick}>
                <ArrowBackIcon /> Back
            </IconButton>

            <div className="forgotPasswordContainer">
                <div className="formContainer">
                    <div className="formField">
                        <TextField
                        label="Old password"
                        fullWidth
                        variant="outlined"
                        onChange={handleOldPassword}
                        value={oldPassword}
                        error={error}
                        />
                    </div>
                </div>

                <div className="formContainer">
                    <div className="formField">
                        <TextField
                        label="New password"
                        fullWidth
                        variant="outlined"
                        onChange={handleNewPassword}
                        value={newPassword}
                        error={error}
                        />
                    </div>
                </div>

                <div className="formContainer">
                    <div className="formField">
                        <TextField
                        label="Confirm password"
                        fullWidth
                        variant="outlined"
                        onChange={handleConfirmPassword}
                        value={confirmPassword}
                        error={error}
                        />
                    </div>
                </div>

                <div className="buttonContainer">
                    <Button variant="contained" color="primary" className="submitBtn" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>

                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert severity="success">
                        Password changed!
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );

}