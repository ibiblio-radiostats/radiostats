import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("render without crashing", () => {
    it("renders the header", () => {
        const div = document.createElement("div");
        ReactDOM.render(<BrowserRouter> <Home/> </BrowserRouter>, div);
    })
})