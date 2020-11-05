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
        localStorage.setItem("userTitle", "Radio User")
        const { queryByTestId } = render(<BrowserRouter> <Header /> </BrowserRouter>)
        expect(queryByTestId("greetingsContainer")).toHaveTextContent("Hi Radio User!")
    })

    it("logging in as ibiblio admin", () => {
        localStorage.setItem("userTitle", "Admin")
        const { queryByTestId } = render(<BrowserRouter> <Header /> </BrowserRouter>)
        expect(queryByTestId("greetingsContainer")).toHaveTextContent("Hi Admin!")
    })
})

describe("logging out", () => {
    it("clears items in localStorage", () => {
        localStorage.setItem("user", "alowhrnskkapslllwqqoijan")
        localStorage.setItem("userTitle", "Admin")

        const wrapper = shallow(<Header />)
        wrapper.find('#logoutBtn').simulate('click')
        
        expect(localStorage.getItem("user")).toBe(null);
        expect(localStorage.getItem("userTitle")).toBe(null);
    })
})