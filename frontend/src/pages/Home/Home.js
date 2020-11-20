import React from 'react';
import Header from '../../components/Header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import FilterModal from './FilterModal';
import ArrowDropDownBtn from './ArrowDropDownBtn';
import { sortCost, sortMonth, sortYear, sortStations } from '../../functions/Sort';
import { addKeys } from '../../functions/Bills';
import axios from 'axios'
import './Home.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bills: [],
            page: 0,
            rowsPerPage: 7,
            previousCategory: "",
            user: "",
            categorySelected: {
                "audit_status": "desc",
                "bill_transit": "desc",
                "stations": "desc",
                "month"   : "desc",
                "year"    : "desc",
                "cost"    : "desc",
            },
        };
        this.applyFilter = this.applyFilter.bind(this);
        this.sortCategory = this.sortCategory.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    async componentDidMount() {
        // Axios call for bills.
        var user = localStorage.getItem('user');
        try {
            await axios.get(`${window._env_.BACKEND_BASE_URL}api/usage/`, {
            headers: {
                Authorization: `Token ${user}`
            }
            }).then((res => {
                // Adding additional keys.
                res.data = addKeys(res.data);
        
                // Setting new state.
                this.setState({
                    bills: res.data,
                    user: user,
                })
            }));
        } catch(e) {
            console.log(e);
        }

    }

    // Individual sorts on categories.
    async sortCategory(category, sort) {
        // Variables for the updated state.
        var sortedBills = [];
        var updatedCategory = JSON.parse(JSON.stringify(this.state.categorySelected));
        updatedCategory[this.state.previousCategory] = "desc";
        updatedCategory[category] = sort;

        // Determining which category to sort on.
        switch(category) {
            case "stations":
                sortedBills = sortStations(this.state.bills, sort);
                break;
            case "month":
                sortedBills = sortMonth(this.state.bills, sort);
                break;
            case "year":
                sortedBills = sortYear(this.state.bills, sort);
                break;
            case "cost":
                sortedBills = sortCost(this.state.bills, sort);
                break;
            default:
                var response = await axios.get(`${window._env_.BACKEND_BASE_URL}api/usage/?order_by=${category}:${sort}`, {
                    headers: {
                        Authorization: `Token ${this.state.user}`
                    }
                })
                
                // Adding additional keys.
                response.data = addKeys(response.data);
                sortedBills = response.data;
            }

        // Setting the state to be the sorted bills.
        this.setState({
            bills: sortedBills,
            categorySelected: updatedCategory,
            previousCategory: category
        })
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
        var response = await axios.get(
            `${window._env_.BACKEND_BASE_URL}api/usage/?${auditStatus}start_dt=${startDate.toISOString()}&end_dt=${endDate.toISOString()}`, {
            headers: {
                Authorization: `Token ${this.state.user}`
            }
        });

        // Adding additional keys.
        response.data = addKeys(response.data);

        // Setting the state to be the filtered bills.
        this.setState({
            bills: response.data
        })
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
        return (
            <div className="homePage">
                <Header/>
                <div id="tableHeader">
                    <div id = "topBar">
                        <h2 style={{"marginLeft":"1%"}}>
                            Monthly Usage Information
                            <span className="filter">
                                <FilterModal applyFilter={this.applyFilter}/>
                             </span>
                        </h2>
                    </div>
                </div>
                <TableContainer component={Paper} key="homeTable" id="tableContainer">
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow id="header">
                        <TableCell>
                            Radio Station
                            <ArrowDropDownBtn category={"stations"} sortCategory={this.sortCategory} initSort={this.state.categorySelected["stations"]}/>
                        </TableCell>
                        <TableCell>
                            Month
                            <ArrowDropDownBtn category={"month"} sortCategory={this.sortCategory} initSort={this.state.categorySelected["month"]}/>
                        </TableCell>
                        <TableCell>
                            Year
                            <ArrowDropDownBtn category={"year"} sortCategory={this.sortCategory} initSort={this.state.categorySelected["year"]}/>
                        </TableCell>
                        <TableCell>
                            Bandwidth Usage
                            <ArrowDropDownBtn category={"bill_transit"} sortCategory={this.sortCategory} initSort={this.state.categorySelected["bill_transit"]}/>
                        </TableCell>
                        <TableCell>
                            Cost
                            <ArrowDropDownBtn category={"cost"} sortCategory={this.sortCategory} initSort={this.state.categorySelected["cost"]}/>
                        </TableCell>
                        <TableCell>
                            Audit Status
                            <ArrowDropDownBtn category={"audit_status"} sortCategory={this.sortCategory} initSort={this.state.categorySelected["audit_status"]}/>
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.bills
                    .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                    .map((bill) => (
                            <TableRow key={bill.id}>
                            <TableCell >{bill.stations}</TableCell>
                            <TableCell >{bill.month}</TableCell>
                            <TableCell >{bill.year}</TableCell>
                            <TableCell >{bill.bill_transit}</TableCell>
                            <TableCell >{`$${bill.cost}`}</TableCell>
                            <TableCell >{bill.audit_status}</TableCell>
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
        );
    }
}
