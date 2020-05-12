import React from "react";
import Button from "./button";
import "./landingPage.css";
import api from '../api'

import {FaArrowLeft} from "react-icons/fa";
import logo from "./../image/logo.png"
import { refreshHostPage } from '../redux/actions'
import { connect } from 'react-redux'

import { Link, BrowserRouter} from "react-router-dom";

class LandingPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pagePosition: 1,
            input:"",
            incorrectCode: false
        };
        this.changePagePosition = this.changePagePosition.bind(this);
        this.create = this.create.bind(this);
        this.login = this.login.bind(this);
        this.create();
    }

    changePagePosition(pos) {
        this.setState({pagePosition: pos});
    }


    create(){
        console.log("Create room!!");
        api.createParty()
        .then(response => {
            // console.log(response.json());
            if (response["status"] === 404){
                console.log("Authorize fail!!! Need to login!!!");
                this.changePagePosition(3);
            }else if (response["status"] === 200){
                console.log("Authorize successful!!!");
                response.json().then(json => {
                        this.props.refreshHostPage(json);
                        this.changePagePosition(0);
                });
            }
        }).catch(e=> {
            console.log("Create room failed: " + e);
            this.changePagePosition(3);
        });
    }

    login(){
        api.login()
        // fetch('http://localhost:1000/auth/spotify', {
        //     method: 'GET',
        //     mode: 'no-cors',
        //     credentials: 'include',
        //     headers: {
        //         Accept:"*/*",
        //         "Content-Type": "application/json;charset=utf-8"
        //     },
        // }).then(response => {
        //     // console.log(response.json());
        //     if (response["status"] === 404){
        //         console.log("Login fail!!!");
        //
        //     }else if (response["status"] === 0){
        //         console.log("Login successful, fetching user info...");
        //         // this.create();
        //     }
        // }).catch(function (e) {
        //     console.log("Login failed: " + e);
        // });
    }

    checkGuestCode(){
        api.checkPartyCode(this.state.input)
        .then(response =>{
            if (response["status"] == 404){
                console.log("login failed!")
                this.setState({
                    incorrectCode: true
                })
            }else{
                this.setState({
                    incorrectCode: false
                })
                
            }
        })
    }

    testPlaylistUpload(){
        api.uploadPlayList("12345", data)
    }

    handleChange(event){
        this.setState({
            input: event.target.value,
            incorrectCode: false
        })
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
                            <Button name={"AUTHORIZING"} type={"main"} pos={0} disable = {true} changePagePosition={this.changePagePosition}/>
                            <Button name={"JOIN PARTY"} type={"main"} pos={0} changePagePosition={this.changePagePosition} />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={"landingPage"}>
                        <img className={"logo"} src={logo} alt={"logo"} />
                        <div className={"joining"}>
                            { this.state.incorrectCode && <span className={"error"}> Couldn't find party, please try again.</span> }
                            <div className={"inputArea"}>
                                <button className={"arrow"} onClick={() => this.changePagePosition(0)}><FaArrowLeft/></button>
                                <input className={"codeInput"} type={"text"} placeholder={"ENTER CODE"} onChange={event => this.handleChange(event)}/>
                            </div>
                            <button className={"button animateIn main"} type={"main"} onClick={() => this.checkGuestCode()}>JOIN</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={"landingPage"}>
                        <img className={"logo"} src={logo} alt={"logo"} />
                        <div className={"joining"}>
                            <div className={"login"}>
                                <button className={"button animateIn main"} type={"main"} onClick={() => this.login()}> LOGIN </button>
                                <Button name={"JOIN PARTY"} type={"main"} pos={0} changePagePosition={this.changePagePosition} />
                            </div>
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
};

export const ReduxLandingPage = connect(null, mapDispatchToProps)(LandingPage);



export default LandingPage;
