import React from 'react';
import ReactDOM from 'react-dom';
import Approval from './Approvals';
import TableRow from '@material-ui/core/TableRow';
import { BrowserRouter } from 'react-router-dom';
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("render without crashing", () => {
    it("renders the header", () => {
        const div = document.createElement("div");
        ReactDOM.render(<BrowserRouter> <Approval/> </BrowserRouter>, div);
    })
})

describe("handle select all checkbox", () => {
    it("changes all checkboxes to be selected", () => {
        const wrapper = shallow(<Approval/>)
        wrapper.setState({
            bills: {
                "1": {
                    "id": 1,
                    "report_dtm": "2020-11-04T17:39:21Z",
                    "bill_start": "2020-11-04T17:39:22Z",
                    "bill_end": "2020-11-04T17:39:23Z",
                    "audit_status": "PROCESSING",
                    "bill_transit": 2,
                    "cost_mult": 2,
                    "sid": 1,
                    "stations": "WCPE",
                    "year": 2020
                }
            },
            checked: {
                "1": false
            }
    })

        const event = {
            target: {
                checked: true
            }
        }

        const checkAllBox = wrapper.find("#checkAllBox")
        checkAllBox.simulate('check', event)
        // expect()
    })
})

describe("no bills", () => {
    it("empty bill list", () => {
        const wrapper = shallow(<Approval/>)
        const nRows   = wrapper.find(TableRow).length;
        expect(nRows).toBe(2)
    })
})

describe("adding bills", () => {
    it("adding one bill", () => {
        const wrapper = shallow(<Approval/>)
        wrapper.setState({
            bills: {
            "1": {
                "id": 1,
                "report_dtm": "2020-11-04T17:39:21Z",
                "bill_start": "2020-11-04T17:39:22Z",
                "bill_end": "2020-11-04T17:39:23Z",
                "audit_status": "PROCESSING",
                "bill_transit": 2,
                "cost_mult": 2,
                "sid": 1,
                "stations": "WCPE",
                "year": 2020
            }
        }})
        const nRows   = wrapper.find(TableRow).length;
        expect(nRows).toBe(3)
    })

    it("adding three bills", () => {
        const wrapper = shallow(<Approval/>)
        wrapper.setState({
            bills: {
            "1": {
                "id": 1,
                "report_dtm": "2020-11-04T17:39:21Z",
                "bill_start": "2020-11-04T17:39:22Z",
                "bill_end": "2020-11-04T17:39:23Z",
                "audit_status": "PROCESSING",
                "bill_transit": 2,
                "cost_mult": 2,
                "sid": 1,
                "stations": "WCPE",
                "year": 2020
            },
            "2": {
                "id": 2,
                "report_dtm": "2020-11-04T17:39:21Z",
                "bill_start": "2020-11-04T17:39:22Z",
                "bill_end": "2020-11-04T17:39:23Z",
                "audit_status": "PROCESSED",
                "bill_transit": 2,
                "cost_mult": 2,
                "sid": 1,
                "stations": "WCPE",
                "year": 2020
            },
            "3": {
                "id": 3,
                "report_dtm": "2020-11-04T17:39:21Z",
                "bill_start": "2020-11-04T17:39:22Z",
                "bill_end": "2020-11-04T17:39:23Z",
                "audit_status": "UNUSABLE",
                "bill_transit": 2,
                "cost_mult": 2,
                "sid": 1,
                "stations": "WCPE",
                "year": 2020
            }
        }})
        const nRows = wrapper.find(TableRow).length;
        expect(nRows).toBe(5)
    })
})

describe("removing all bills", () => {
    it("checking all bills and rejecting", () => {
        // Creating bills.
        const wrapper = shallow(<Approval/>)
        wrapper.setState({
            bills: {
                "1": {
                    "id": 1,
                    "report_dtm": "2020-11-04T17:39:21Z",
                    "bill_start": "2020-11-04T17:39:22Z",
                    "bill_end": "2020-11-04T17:39:23Z",
                    "audit_status": "PROCESSING",
                    "bill_transit": 2,
                    "cost_mult": 2,
                    "sid": 1,
                    "stations": "WCPE",
                    "year": 2020
                }
            },
            checked: {
                "1": false
            }
        })

        const event = {
            target: {
                checked: true
            }
        }

        wrapper.find("#checkAllBox").simulate("change", event)
        wrapper.find("#rejectButton").simulate("click")
    })
})

describe("dummy button clicks", () => {
    it("approve button click", () => {
        const wrapper = shallow(<Approval/>)
        wrapper.setState({
            bills: {
                "1": {
                    "id": 1,
                    "report_dtm": "2020-11-04T17:39:21Z",
                    "bill_start": "2020-11-04T17:39:22Z",
                    "bill_end": "2020-11-04T17:39:23Z",
                    "audit_status": "PROCESSING",
                    "bill_transit": 2,
                    "cost_mult": 2,
                    "sid": 1,
                    "stations": "WCPE",
                    "year": 2020
                }
            }
        })
        wrapper.find("#approveButton").simulate('click')
        expect(wrapper.find(TableRow).length).toBe(3) 
    })

    it("reject button click", () => {
        const wrapper = shallow(<Approval/>)
        wrapper.setState({
            bills: {
                "1": {
                    "id": 1,
                    "report_dtm": "2020-11-04T17:39:21Z",
                    "bill_start": "2020-11-04T17:39:22Z",
                    "bill_end": "2020-11-04T17:39:23Z",
                    "audit_status": "PROCESSING",
                    "bill_transit": 2,
                    "cost_mult": 2,
                    "sid": 1,
                    "stations": "WCPE",
                    "year": 2020
                }
            }
        })
        wrapper.find("#rejectButton").simulate('click')
        expect(wrapper.find(TableRow).length).toBe(3) 
    })
})