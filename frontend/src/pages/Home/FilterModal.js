import 'date-fns';
import React from 'react';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Filter from '../../assets/Filter.png';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: '80vh',
      height: '20vh',
    },
  }));

export default function FilterModal({applyFilter}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = React.useState(new Date());
  const [processing, setProcessing] = React.useState("PROCESSING");
  const [processed, setProcessed] = React.useState("PROCESSED");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilter = () => {
      setOpen(false);
      applyFilter(new Date(startDate), new Date(endDate), processing, processed);
  }

  const handleProcessing = (event) => {
    if (event.target.checked) {
        setProcessing(event.target.value);
    } else {
        setProcessing("");
    }
  }

  const handleProcessed = (event) => {
    if (event.target.checked) {
        setProcessed(event.target.value);
    } else {
        setProcessed("");
    }
  }
  
    return (
        <div>
            <IconButton style={{width: "80%", height: "40%"}} onClick={handleOpen}> <img src={Filter} alt="filter"/> </IconButton>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
            <Fade in={open}>
                <div className={classes.paper}>
                     <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around" direction="row">
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="start-date-picker"
                                label="Start date"
                                value={startDate}
                                onChange={setStartDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                />
                            <KeyboardDatePicker
                                 disableToolbar
                                 variant="inline"
                                 format="MM/dd/yyyy"
                                 margin="normal"
                                 id="end-date-picker"
                                 label="End date"
                                 value={endDate}
                                 onChange={setEndDate}
                                 KeyboardButtonProps={{
                                     'aria-label': 'change date',
                                 }}
                            />
                        </Grid>
                        <Grid container justify="space-around" direction="row">
                            <span> <Checkbox color="primary" checked={processing !== ""} onChange={handleProcessing} value="PROCESSING"/> Processing </span>
                            <span> <Checkbox color="primary" checked={processed  !== ""}onChange={handleProcessed} value="PROCESSED"/> Processed </span>
                        </Grid>
                        <Grid container justify="space-around" direction="row">
                            <Button onClick={handleFilter}> Apply </Button>
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>
            </Fade>
            </Modal>
        </div>
    );
}