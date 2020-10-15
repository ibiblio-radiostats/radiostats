import React from 'react';
import Header from '../../components/Header';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ApprovalBill from './ApprovalBill';
import axios from 'axios';
import './Approval.css';

// TODO: Change rows to be an object and delete the key when approved/deleted - avoids O(N) operation.

// Retrieving the month and year.
const monthNumToName = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

export default class Approvals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bills: [],
            checked: {},
            buttonsSelected: {}
        };
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.handleBill = this.handleBill.bind(this);
    }
    // Retrieves all bills when mounted.
    async componentDidMount() {
        // Axios call for bills.
        const initBills = await axios.get('http://127.0.0.1:8000/api/usage?approval=test');
        var initChecked = {};
        
        // Insert month and dates for ease.
        for (var i = 0; i < initBills.data.length; i++) {
            let date = new Date(initBills.data[i].bill_start);
            initBills.data[i].month = monthNumToName[date.getMonth() + 1];
            initBills.data[i].year = date.getFullYear();
            initChecked[initBills.data[i].stations] = false;
        }

        // Setting state.
        this.setState({
            bills: initBills.data,
            checked: initChecked,
        })
    }
    // Called once a checkbox is checked. Displays the status buttons.
    handleCheckBoxChange(radioStationName, event) {
        // Changing the checked state of the caller.
        // Creating a deep copy of [checked] and change the key [radioStationName]'s value.
        var newChecked = JSON.parse(JSON.stringify(this.state.checked));
        newChecked[radioStationName] = event.target.checked;

        // Creating a deep copy of [buttonsSelected].
        var newButtonsSelected = JSON.parse(JSON.stringify(this.state.buttonsSelected));
        
        // If the number of buttons selected is 0, hide the buttons.
        if (event.target.checked) {
            newButtonsSelected[radioStationName] = 1;
            // Setting new state.
            this.setState({
                buttonsSelected: newButtonsSelected,
                checked: newChecked
            })
            
        // If the number of buttons selected is 0, hide the buttons.
        } else {
            delete newButtonsSelected[radioStationName]
            this.setState({
                buttonsSelected: newButtonsSelected,
                checked: newChecked
            })
        }
    }
    // Called once the 'check-all' checkbox has been checked.
    handleCheckAll(event) {
        // New state variable for [checked].
        var newChecked = {};
        Object.keys(this.state.checked).map((key) => (
            newChecked[key] = event.target.checked
        ));
        if (event.target.checked) {
            this.setState({
                buttonsSelected: this.state.checked,
                checked: newChecked
            })
        } else {
            this.setState({
                buttonsSelected: {},
                checked: newChecked
            })
        }
    }

    // Handles bill approval/rejection.
    async handleBill(type, event) {
        var newBills = JSON.parse(JSON.stringify(this.state.bills));
        var keys = Object.keys(this.state.buttonsSelected);
        for (var i = 0; i < keys.length; i++) {
            for (var j = 0; j < newBills.length; j++) {
                // If a match is found, remove it.
                if (newBills[j].stations === keys[i]) {
                    // Change status to UNUSABLE
                    await axios.patch(`http://127.0.0.1:8000/api/usage/${newBills[j].id}/?status=${type}&approval=test`);
                    // Remove from state.
                    newBills.splice(j, 1);
                }
            }
        }
        this.setState({
            bills: newBills
        });
    }
    render() {
        // Approve button.
        let approveButton= <Button
            color="primary"
            variant="contained"
            id="approveButton"
            disabled={!Object.keys(this.state.buttonsSelected).length}
            onClick={(e) => this.handleBill("PROCESSED", e)}> 
            Approve 
        </Button>

        // Reject button.
        let rejectButton = 
        <Button
            color="secondary" 
            variant="contained"
            id="rejectButton"
            disabled={!Object.keys(this.state.buttonsSelected).length}
            onClick={(e) => this.handleBill("UNUSABLE", e)}>
            Reject
        </Button>

        return (
            <div className="approvalPage">
                <Header />
                <div className="approvalContainer">
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead id="topBar">
                                <TableCell padding="checkbox" align="left"><Checkbox color='default' onChange={this.handleCheckAll}/></TableCell>
                                <TableCell align="justify"> </TableCell>
                                <TableCell align="justify"> </TableCell>
                                <TableCell align="justify"> </TableCell>
                                <TableCell align="justify"> </TableCell>
                                <TableCell align="right"> {rejectButton} {approveButton} </TableCell>
                            </TableHead>
                            <TableHead>
                                <TableRow>
                                    <TableCell id="header" padding="checkbox" align="justify"></TableCell>
                                    <TableCell id="header" align="justify">Radio Station </TableCell>
                                    <TableCell id="header" align="justify">Month</TableCell>
                                    <TableCell id="header" align="justify">Year</TableCell>
                                    <TableCell id="header" align="justify">Bandwidth Usage</TableCell>
                                    <TableCell id="header" align="right">Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.bills.map((bill) => (
                                    <ApprovalBill
                                        key={bill.stations}
                                        radioStation={bill.stations}
                                        month={bill.month}
                                        year={bill.year}
                                        bandwidthUsage={bill.bill_transit}
                                        cost={`$${(bill.bill_transit * bill.cost_mult).toFixed(2)}`}
                                        handleCheckBoxChange={this.handleCheckBoxChange}
                                        checked={this.state.checked[bill.stations]}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        );
    }
}