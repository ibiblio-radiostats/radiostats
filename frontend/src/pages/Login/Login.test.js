import React from 'react';
import Login from './Login';
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";

configure({ adapter: new Adapter() });

describe("error text", () => {
    it("username error", () => {
        const wrapper = shallow(<Login />)
        wrapper.setState({error: true})
        expect(wrapper.find("#filled-username-input").props().helperText).toBe("Invalid credentials.")
    })

    it("password error", () => {
        const wrapper = shallow(<Login />)
        wrapper.setState({error: true})
        expect(wrapper.find("#filled-password-input").props().helperText).toBe("Invalid credentials.")
    })
})

describe("empty textfields", () => {
    it("no text in username", () => {
        const wrapper = shallow(<Login/>)
        const userTextField = wrapper.find("#filled-username-input")
        expect(userTextField.props().value).toBe("")
    })

    it("no text in password", () => {
        const wrapper = shallow(<Login/>)
        const passwordTextField = wrapper.find("#filled-password-input")
        expect(passwordTextField.props().value).toBe("")
    })
})

describe("inputting values into textfield", () => {
    it("input username", () => {
        const wrapper = shallow(<Login />)
        wrapper.setState({username: "WCPE"})
        const userTextField = wrapper.find("#filled-username-input")
        expect(userTextField.props().value).toBe("WCPE")
    })

    it("input password", () => {
        const wrapper = shallow(<Login />)
        wrapper.setState({password: "password"})
        const passwordTextField = wrapper.find("#filled-password-input")
        expect(passwordTextField.props().value).toBe("password")
    })
})

describe("'forgot password' button click", () => {
    it("registers 'forgot password' click event", () => {
        const wrapper = shallow(<Login/>)
        const forgotPasswordBtn = wrapper.find("#forgotPasswordBtn")
        const userTextField = wrapper.find("#filled-username-input")
        const passwordTextField = wrapper.find("#filled-password-input")
        forgotPasswordBtn.simulate('click')
        expect(userTextField.props().helperText).toBe("")
        expect(passwordTextField.props().value).toBe("")
    })
})