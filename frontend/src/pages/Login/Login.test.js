import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";

configure({ adapter: new Adapter() });

describe("error text", () => {
    it("occurs when credentials given are invalid", () => {
        const wrapper = shallow(<Login />)
        wrapper.setState({error: true})
        expect(wrapper.contains("Invalid credentials.")).toBe(false)
    })
})