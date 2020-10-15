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
const rows = [
    { radioStation: 'WCPE', month: 'September', year: '2020', bandwidthUsage: "20 bytes",   cost: "$63.29"},
    { radioStation: 'WNCW', month: 'September', year: '2020', bandwidthUsage: "38.6 bytes", cost: "$46.17" },
    { radioStation: 'WXYC', month: 'October'  , year: '2020', bandwidthUsage: "20 bytes",   cost: "$32.12" },
];
export default class Approvals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            approvals: [],
            checked: {},
            buttonsSelected: {}
        };
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.handleBill = this.handleBill.bind(this);
    }
    // Retrieves all bills when mounted.
    componentDidMount() {
        // Axios call for reports.

        // Call to retrieve.
        let initApprovals = rows;
        let initChecked = {};
        for (var i = 0; i < rows.length; i++) {
            // Populating checked.
            initChecked[rows[i].radioStation] = false;
        }
        // Setting state.
        this.setState({
            approvals: initApprovals,
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
    handleBill(type, event) {
        var newApprovals = JSON.parse(JSON.stringify(this.state.approvals));
        var keys = Object.keys(this.state.buttonsSelected);
        for (var i = 0; i < keys.length; i++) {
            if (type === "approve") {
                // Approve here.
            } else if (type === "reject") {
                // Reject here.
            } else {
                throw new Error("Bad bill type. Only approve and reject are allowed.");
            }
            
            // Iterate and splice.
            for (var j = 0; j < newApprovals.length; j++) {
                console.log(newApprovals[j])
                if (newApprovals[j].radioStation === keys[i]) newApprovals.splice(j, 1);
            }
        }
        this.setState({
            approvals: newApprovals
        });
    }
    render() {
        // Approve button.
        let approveButton= <Button
            color="primary"
            variant="contained"
            id="approveButton"
            disabled={!Object.keys(this.state.buttonsSelected).length}
            onClick={(e) => this.handleBill("approve", e)}> 
            Approve 
        </Button>
        // Reject button.
        let rejectButton = 
        <Button
            color="secondary" 
            variant="contained"
            id="rejectButton"
            disabled={!Object.keys(this.state.buttonsSelected).length}
            onClick={(e) => this.handleBill("reject", e)}>
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
                                {this.state.approvals.map((row) => (
                                    <ApprovalBill
                                        key={row.radioStation}
                                        radioStation={row.radioStation}
                                        month={row.month}
                                        year={row.year}
                                        bandwidthUsage={row.bandwidthUsage}
                                        cost={row.cost}
                                        handleCheckBoxChange={this.handleCheckBoxChange}
                                        checked={this.state.checked[row.radioStation]}
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