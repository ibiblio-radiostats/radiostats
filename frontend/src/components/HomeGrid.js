import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  header: {
    "font-weight": "bold"
  }
});

const rows = [
  { radioStation: 'WCPE', month: 'September', year: '2020', bandwidthUsage: "20 bytes", cost: "$63.29", auditStatus: "Processing"},
  { radioStation: 'WNCW', month: 'September', year: '2020', bandwidthUsage: "38.6 bytes", cost: "$46.17", auditStatus: "Processed" },
  { radioStation: 'WXYC', month: 'October'  , year: '2020', bandwidthUsage: "20 bytes", cost: "$32.12", auditStatus: "Processing"},
];

export default function ApprovalGrid() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} key="homeTable">
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow key="header">
            <TableCell className={classes.header}>Radio Station </TableCell>
            <TableCell className={classes.header}>Month</TableCell>
            <TableCell className={classes.header}>Year</TableCell>
            <TableCell className={classes.header}>Bandwidth Usage</TableCell>
            <TableCell className={classes.header}>Cost</TableCell>
            <TableCell className={classes.header}>Audit Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell >{row.radioStation}</TableCell>
              <TableCell >{row.month}</TableCell>
              <TableCell >{row.year}</TableCell>
              <TableCell >{row.bandwidthUsage}</TableCell>
              <TableCell >{row.cost}</TableCell>
              <TableCell >{row.auditStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}