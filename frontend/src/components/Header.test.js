import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Adapter from "enzyme-adapter-react-16";
import { BrowserRouter } from 'react-router-dom';
import { render } from "@testing-library/react";
import { shallow, configure } from "enzyme";
import Button from '@material-ui/core/Button';

configure({ adapter: new Adapter() });

// describe("render without crashing", () => {
//     it("renders the header", () => {
//         const div = document.createElement("div");
//         ReactDOM.render(<Header/>, div);
//     })
// })

describe("render dynamic user title", () => {
    it("logging in as radio station user", () => {
        sessionStorage.setItem("userTitle", "Radio User")
        const { queryByTestId } = render(<BrowserRouter> <Header /> </BrowserRouter>)
        expect(queryByTestId("greetingsContainer")).toHaveTextContent("Hi Radio User!")
    })

    it("logging in as ibiblio admin", () => {
        sessionStorage.setItem("userTitle", "Admin")
        const { queryByTestId } = render(<BrowserRouter> <Header /> </BrowserRouter>)
        expect(queryByTestId("greetingsContainer")).toHaveTextContent("Hi Admin!")
    })
})

describe("logging out", () => {
    it("clears items in sessionStorage", () => {
        sessionStorage.setItem("user", "alowhrnskkapslllwqqoijan")
        sessionStorage.setItem("userTitle", "Admin")

        const wrapper = shallow(<Header />)
        wrapper.find('#logoutBtn').simulate('click')
        
        expect(sessionStorage.getItem("user")).toBe(null);
        expect(sessionStorage.getItem("userTitle")).toBe(null);
    })
})