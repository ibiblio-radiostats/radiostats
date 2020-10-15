import React from 'react';
import Header from '../../components/Header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios'
import Filter from '../../assets/Filter.png';
import FilterModal from './FilterModal';
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
        this.openModal = this.openModal.bind(this);
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

    openModal(event) {
        this.setState({
            openModal: true
        });
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
                                <IconButton style={{width: "80%", height: "40%"}} onClick={this.openModal}> <img src={Filter} alt="filter"/> </IconButton> 
                             </span>
                             {/* <FilterModal open={this.state.openModal}/> */}
                        </h2>
                    </div>
                    <TableContainer component={Paper} key="homeTable">
                    <Table aria-label="simple table">
                    <TableHead>
                        <TableRow id="header">
                            <TableCell>Radio Station </TableCell>
                            <TableCell>Month</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Bandwidth Usage</TableCell>
                            <TableCell>Cost</TableCell>
                            <TableCell>Audit Status</TableCell>
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