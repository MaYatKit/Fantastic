import React from "react";
import Button from "./button";
import "./landingPage.css";

import {FaArrowLeft} from "react-icons/fa";
import logo from "./../image/logo.png"
import { refreshHostPage } from '../redux/actions'
import { connect } from 'react-redux'

class LandingPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pagePosition: 1,
        };
        this.changePagePosition = this.changePagePosition.bind(this);
        this.create = this.create.bind(this);
        this.create();
    }

    changePagePosition(pos) {
        this.setState({pagePosition: pos});
    }


    create(){
        console.log("Create room!!");
        fetch('http://localhost:1000/auth/create', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=utf-8"
            },
        }).then(response => {
            // console.log(response.json());
            console.log("Authorize successful!!!");
            response.json().then(json => {
                if (json["status"] === "ok"){
                    this.props.refreshHostPage(json);
                    this.changePagePosition(0);
                }
            });
        }).catch(function (e) {
            console.log("Create room failed: " + e);
        });
    }

    render() {
        switch (this.state.pagePosition) {
            case 0:
                return (
                    <div className={"landingPage"}>
                        <img className={"logo"} src={logo} alt={"logo"} />
                        <div className={"landing"}>
                            <Button name={"CREATE PARTY"} type={"main"} pos={1} changePagePosition={this.changePagePosition} />
                            <Button name={"JOIN PARTY"} type={"main"} pos={2} changePagePosition={this.changePagePosition} />
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className={"landingPage"}>
                        <img className={"logo"} src={logo} alt={"logo"} />
                        <div className={"creating"}>
                            <Button name={"Authorizing"} type={"main"} pos={0} disable = {true} changePagePosition={this.changePagePosition}/>
                            <Button name={"JOIN PARTY"} type={"main"} pos={0} changePagePosition={this.changePagePosition} />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={"landingPage"}>
                        <img className={"logo"} src={logo} alt={"logo"} />
                        <div className={"joining"}>
                            <div className={"inputArea"}>
                                <button className={"arrow"} onClick={() => this.changePagePosition(0)}><FaArrowLeft/></button>
                                <input className={"codeInput"} type={"text"} placeholder={"ENTER CODE"} />
                            </div>
                            <Button name={"JOIN"} type={"main"} />
                        </div>
                    </div>
                );
            default:
                break;
        }
    }
}


const mapDispatchToProps = dispatch => {
    return {
        refreshHostPage: data => dispatch(refreshHostPage(data))
    }
}

export const ReduxLandingPage = connect(null, mapDispatchToProps)(LandingPage);



export default LandingPage;
