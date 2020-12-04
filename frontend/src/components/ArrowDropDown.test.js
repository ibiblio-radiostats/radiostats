import React from 'react';
import ReactDOM from 'react-dom';
import ArrowDropDownBtn from './ArrowDropDownBtn';
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

configure({ adapter: new Adapter() });

describe("render without crashing", () => {
    it("renders the dropdown arrow", () => {
        const div = document.createElement("div");
        ReactDOM.render(<ArrowDropDownBtn/>, div);
    })
})

describe("rendering directional arrow", () => {
    it("ascending arrow", () => {
        const wrapper = shallow(<ArrowDropDownBtn initSort={"asc"}/>)
        expect(wrapper.find(ArrowDropUpIcon).length).toBe(1)

    })

    it("descending arrow", () => { 
        const wrapper = shallow(<ArrowDropDownBtn initSort={"desc"} />)
        expect(wrapper.find(ArrowDropDownIcon).length).toBe(1)
    })
})

describe("rendering bad directional arrow", () => {
    it("ascending arrow", () => {
        const wrapper = shallow(<ArrowDropDownBtn initSort={"asc"}/>)
        expect(wrapper.find(ArrowDropDownIcon).length).toBe(0)

    })

    it("descending arrow", () => { 
        const wrapper = shallow(<ArrowDropDownBtn initSort={"desc"} />)
        expect(wrapper.find(ArrowDropUpIcon).length).toBe(0)
    })
})