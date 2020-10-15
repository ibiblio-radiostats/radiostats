import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';

export default class ApprovalBill extends React.Component {
    constructor(props) {
        super(props);
        this.setChecked = this.setChecked.bind(this);
    }

    // Updates the checkbox's state.
    setChecked(newCheckedValue) {
        this.setState({
            checked: newCheckedValue
        })
    }

    render() {
        return (
            <TableRow key={this.props.radioStation}>
                <TableCell padding="checkbox" align="justify">
                    <Checkbox
                    color="default"
                    checked={this.props.checked}
                    onChange={(e) => this.props.handleCheckBoxChange(this.props.radioStation, e)}/>
                </TableCell>
                <TableCell align="justify">{this.props.radioStation} </TableCell>
                <TableCell align="justify">{this.props.month}</TableCell>
                <TableCell align="justify">{this.props.year}</TableCell>
                <TableCell align="justify">{this.props.bandwidthUsage}</TableCell>
                <TableCell align="right">{this.props.cost}</TableCell>
            </TableRow>
        );
    }
}