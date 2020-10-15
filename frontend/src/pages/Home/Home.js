import React from 'react';
import Header from '../../components/Header';
import HomeGrid from '../../components/HomeGrid';
import axios from 'axios'
import './Home.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            approvals: []
        };
    }

    componentDidMount() {
        console.log("Mounted.");
        axios.get('http://127.0.0.1:8000/api/usage/')
        .then((res) => {
            console.log(res);
        });
    }

    render() {
        return (
            <div className="approvalPage">
                <Header />
                <div className="approvalContainer">
                    <div id = "topBar">
                        <h2 style={{"marginLeft":"1%"}}> Monthly Usage Information </h2>
                    </div>
                    <HomeGrid />
                </div>
            </div>
        );
    }
}