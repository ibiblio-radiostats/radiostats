import React from 'react';
import Header from '../../components/Header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'
import FilterModal from './FilterModal';
import ArrowDropDownBtn from './ArrowDropDownBtn';
import './Home.css';

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

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bills: []
        };
        this.applyFilter = this.applyFilter.bind(this);
        this.sortCategory = this.sortCategory.bind(this);
    }

    async componentDidMount() {
        // Axios call for bills.
        const initBills = await axios.get('http://127.0.0.1:8000/api/usage/');

        // Insert month and dates for ease.
        for (var i = 0; i < initBills.data.length; i++) {
            let date = new Date(initBills.data[i].bill_start);
            initBills.data[i].month = monthNumToName[date.getMonth() + 1];
            initBills.data[i].year = date.getFullYear();
        }
        // Setting new state.
        this.setState({
            bills: initBills.data
        })
    }

    async sortCategory(category, sort) {
        // var filteredBills = await axios.get(`http://127.0.0.1:8000/api/usage/?order_by=${category}:${sort}`);
        // Adding new keys.
        // for (var i = 0; i < filteredBills.data.length; i++) {
        //     let date = new Date(filteredBills.data[i].bill_start);
        //     filteredBills.data[i].month = monthNumToName[date.getMonth() + 1];
        //     filteredBills.data[i].year = date.getFullYear();
        // }
        // console.log(filteredBills.data);

        // // Setting the state to be the filtered bills.
        // this.setState({
        //     bills: filteredBills.data
        // })
    }

    // Applies search filter.
    async applyFilter(startDate, endDate, processing, processed) {
        // Floor and ceiling the date.
        startDate.setDate(1);
        endDate.setDate(new Date(endDate.getFullYear(), endDate.getDate(), 0).getDate());

        // Determining audit status.
        var auditStatus=""
        if (processing !== "" || processed !== "") {
            auditStatus += "audit_status="
            if (processing !== "" && processed !== "") {
                auditStatus+=`${processed},${processing}`
            } else if (processing !== "") {
                auditStatus += processing;
            } else if (processed !== "")  {
                auditStatus += processed;
            }
            auditStatus += "&";
        }
        
        // Retrieving the filtered bills.
        var filteredBills = await axios.get(
            `http://127.0.0.1:8000/api/usage/?${auditStatus}start_dt=${startDate.toISOString()}&end_dt=${endDate.toISOString()}`
        );

        // Adding new keys.
        for (var i = 0; i < filteredBills.data.length; i++) {
            let date = new Date(filteredBills.data[i].bill_start);
            filteredBills.data[i].month = monthNumToName[date.getMonth() + 1];
            filteredBills.data[i].year = date.getFullYear();
        }

        // Setting the state to be the filtered bills.
        this.setState({
            bills: filteredBills.data
        })
    }

    render() {
        return (
            <div className="approvalPage">
                <Header />
                <div className="approvalContainer">
                    <div id = "topBar">
                        <h2 style={{"marginLeft":"1%"}}> 
                            Monthly Usage Information 
                            <span className="filter">
                                <FilterModal applyFilter={this.applyFilter}/>
                             </span>
                        </h2>
                    </div>
                    <TableContainer component={Paper} key="homeTable">
                    <Table aria-label="simple table">
                    <TableHead>
                        <TableRow id="header">
                            <TableCell>
                                Radio Station 
                                <ArrowDropDownBtn category={"stations"} sortCategory={this.sortCategory}/> 
                            </TableCell>
                            <TableCell>
                                Month 
                                <ArrowDropDownBtn category={"bill_start"} sortCategory={this.sortCategory}/> 
                            </TableCell>
                            <TableCell>
                                Year
                                <ArrowDropDownBtn category={"bill_start"} sortCategory={this.sortCategory}/> 
                            </TableCell>
                            <TableCell>
                                Bandwidth Usage
                                <ArrowDropDownBtn category={"bill_transit"} sortCategory={this.sortCategory}/> 
                            </TableCell>
                            <TableCell>
                                Cost 
                                <ArrowDropDownBtn category={"cost"} sortCategory={this.sortCategory}/> 
                            </TableCell>
                            <TableCell>
                                Audit Status
                                <ArrowDropDownBtn category={"audit_status"} sortCategory={this.sortCategory}/> 
                            </TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.bills.map(function(bill) {
                            return <TableRow key={bill.stations}>
                                <TableCell >{bill.stations}</TableCell>
                                <TableCell >{bill.month}</TableCell>
                                <TableCell >{bill.year}</TableCell>
                                <TableCell >{bill.bill_transit}</TableCell>
                                <TableCell >{`$${(bill.bill_transit * bill.cost_mult).toFixed(2)}`}</TableCell>
                                <TableCell >{bill.audit_status}</TableCell>
                            </TableRow>
                        })}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </div>
            </div>
        );
    }
}