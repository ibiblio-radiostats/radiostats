import React from 'react';
import Header from '../../components/Header';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import './Approval.css';

// Retrieving the month and year.
const monthNumToName = ["January", "February", "March",
                        "April"  , "May"     , "June",
                        "July"   , "August"  , "September",
                        "October", "November", "December"]

export default class Approvals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bills: {},
            checked: {},
            billsSelected: {},
            page: 0,
            rowsPerPage: 7,
            user: ""
        };
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleBill = this.handleBill.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    // Retrieves all bills when mounted.
    async componentDidMount() {
        // Axios call for inital bills.
        var user = localStorage.getItem('user');
        var initChecked = {};
        var initBills = {};
        try {
            await axios.get(`${window._env_.BACKEND_BASE_URL}api/usage?approval=test`, {
                headers: {
                    Authorization: `Token ${user}`
                }
            }).then((res) => {
                // Iterating through the response.
                for (var i = 0; i < res.data.length; i++) {
                    // Adding new keys [month], [year], [cost], and [color] to the data.
                    let date = new Date(res.data[i].bill_start);
                    res.data[i].month = monthNumToName[date.getMonth()];
                    res.data[i].year = date.getFullYear();
                    res.data[i].cost = (res.data[i].bill_transit * res.data[i].cost_mult).toFixed(2)

                    // Inserting keys [id] for [initChecked] and [initBills].
                    initChecked[res.data[i].id] = false;
                    initBills[res.data[i].id] = res.data[i];
                }
                // Setting state.
                this.setState({
                    bills: initBills,
                    checked: initChecked,
                    user: user
                })
            })
        } catch(e) {
            // console.log(e);
        }
    }

    // Called once a checkbox is checked. Displays the status buttons.
    handleCheckBoxChange(id, event) {
        // Changing the checked state of the caller.
        var newChecked = JSON.parse(JSON.stringify(this.state.checked));
        newChecked[id] = event.target.checked;

        // Creating a copy of [billsSelected].
        var newBillsSelected = JSON.parse(JSON.stringify(this.state.billsSelected));

        // If the number of buttons selected is 0, hide the buttons.
        if (event.target.checked) {
            newBillsSelected[id] = 1;
            // Setting new state.
            this.setState({
                billsSelected: newBillsSelected,
                checked: newChecked
            })

        // If the number of buttons selected is 0, hide the buttons.
        } else {
            delete newBillsSelected[id]
            this.setState({
                billsSelected: newBillsSelected,
                checked: newChecked
            })
        }
    }

    // Called once the 'check-all' checkbox has been checked.
    handleCheckAll(event) {
        // New state variable for [checked].
        var newChecked = {};

        // Iterate through the keys and change them all to true/false.
        Object.keys(this.state.checked).map((key) => (
            newChecked[key] = event.target.checked
        ));

        // Set new state.
        if (event.target.checked && Object.keys(this.state.bills).length) {
            this.setState({
                billsSelected: this.state.checked,
                checked: newChecked
            })
        } else {
            this.setState({
                billsSelected: {},
                checked: newChecked
            })
        }
    }

    // Handles bill approval/rejection.
    async handleBill(type, event) {
        // New bills.
        var newBills = JSON.parse(JSON.stringify(this.state.bills));
        var newChecked = JSON.parse(JSON.stringify(this.state.checked));
        // Iterating through the bills and approving/rejecting those who are selected.
        var keys = Object.keys(this.state.billsSelected);
        for (var i = 0; i < keys.length; i++) {
            // Change [id]'s status to the type given.
            var id = keys[i];
            // Changing the bill's type and its render effects.
            try {
                await axios.patch(`${window._env_.BACKEND_BASE_URL}api/usage/${id}/?status=${type}&approval=test`, null, {
                    headers: {
                        Authorization: `Token ${this.state.user}`
                    }
                });
            } catch (e) {
                // console.log(e);
            }

            type === "UNUSABLE" ? newBills[id].audit_status = "UNUSABLE" : delete newBills[id];
            newChecked[id] = false;
        }

        // Setting state to be the new bills list post-approval/rejection.
        this.setState({
            bills: newBills,
            billsSelected: {},
            checked: newChecked
        });
    }

    // Refresh the list of bills. 
    async handleRefresh(event) {
        await axios({
            url: `${window._env_.BACKEND_BASE_URL}api/usage/agent/resubmit/`,
            method: 'post',
            headers: {
                Authorization: `Token ${this.state.user}`
            },
            data: {
                "reports": Object.keys(this.state.billsSelected).map(Number)
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    // Changes the page the user is browsing.
    handleChangePage(event, newPage) {
        this.setState({
            page: newPage
        })
    }

    // Changes the number of rows per page the user can browse.
    handleChangeRowsPerPage(event) {
        this.setState({
            rowsPerPage: event.target.value
        })
    }

    render() {
        // Approve button.
        let approveButton =
        <Button
            color="primary"
            variant="contained"
            id="approveButton"
            disabled={!Object.keys(this.state.billsSelected).length}
            onClick={(e) => this.handleBill("PROCESSING", e)}>
            Approve
        </Button>

        // Reject button.
        let rejectButton =
        <Button
            color="secondary"
            variant="contained"
            id="rejectButton"
            disabled={!Object.keys(this.state.billsSelected).length}
            onClick={(e) => this.handleBill("UNUSABLE", e)}>
            Reject
        </Button>

        let refreshButton = 
        <IconButton color="primary" variant="contained" id="refreshButton" onClick={this.handleRefresh}>
            <RefreshIcon/>
        </IconButton>

        return (
            <div className="approvalPage">
                <Header/>
                <div className="tableContainer">
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead id="topBar">
                                <TableRow>
                                    <TableCell padding="checkbox" align="left"><Checkbox id="checkAllBox"color='default' onChange={this.handleCheckAll}/> </TableCell>
                                    <TableCell align="justify"> </TableCell>
                                    <TableCell align="justify"> </TableCell>
                                    <TableCell align="justify"> </TableCell>
                                    <TableCell align="justify"> </TableCell>
                                    <TableCell align="justify"> </TableCell>
                                    <TableCell align="right"> {refreshButton} {rejectButton} {approveButton} </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableHead>
                                <TableRow>
                                    <TableCell id="header" padding="checkbox" align="justify"></TableCell>
                                    <TableCell id="header" align="justify">Radio Station </TableCell>
                                    <TableCell id="header" align="justify">Month</TableCell>
                                    <TableCell id="header" align="justify">Year</TableCell>
                                    <TableCell id="header" align="justify">Bandwidth Usage</TableCell>
                                    <TableCell id="header" align="justify">Status</TableCell>
                                    <TableCell id="header" align="right">Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.values(this.state.bills)
                                .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                .map((bill) => (
                                    <TableRow key={bill.id} style={{"backgroundColor": bill.audit_status === "UNUSABLE" ? "rgb(255,219,233)" : ""}}>
                                        <TableCell padding="checkbox" align="justify">
                                            <Checkbox
                                            color="default"
                                            checked={this.state.checked[bill.id]}
                                            onChange={(e) => this.handleCheckBoxChange(bill.id, e)}/>
                                        </TableCell>
                                        <TableCell align="justify">{bill.stations} </TableCell>
                                        <TableCell align="justify">{bill.month}</TableCell>
                                        <TableCell align="justify">{bill.year}</TableCell>
                                        <TableCell align="justify">{bill.bill_transit}</TableCell>
                                        <TableCell align="justify">{bill.audit_status}</TableCell>
                                        <TableCell align="right">{`$${bill.cost}`}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[7]}
                            component="div"
                            count={Object.keys(this.state.bills).length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </div>
            </div>
        );
    }
}
