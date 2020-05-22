import React from "react";
import Button from "./button";
import "./landingPage.css";
import api from '../api'

import {FaArrowLeft} from "react-icons/fa";
import logo from "./../image/logo.png"
import { updateRoomInfo, updatePlaylist, updateActiveMusicState } from '../redux/actions'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { Link, BrowserRouter} from "react-router-dom";
import playBack from '../playBack';

class LandingPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            spotifyLoggedIn: false,
            joining: false,
            displayLogin: false,
            inputPartyCode: '',
            incorrectCode: false,
            // for redirect
            redirect: false,
            path: undefined
        };
        // this.changePagePosition = this.changePagePosition.bind(this);
        this.create = this.create.bind(this);
        this.login = this.login.bind(this);

        // this.initPlayback = this.initPlayback.bind(this);
        // this.initPlayback();
    }

    inputChange(event){
        this.setState({
            inputPartyCode: event.target.value,
            incorrectCode: false
        })
    }

    // changePagePosition(pos) {
    //     this.setState({pagePosition: pos});
    // }

    changeIntention(){
        this.setState(
            { joining: !this.state.joining }
        )
    }


    create(){
        console.log("Create room!!");
        api.createParty()
        .then(response => {
            if (response["status"] === 404){
                console.log("Authorize fail!!! Need to login!!!");
                this.setState({ displayLogin: true })
                return Promise.reject(response)
            }
            else if (response["status"] === 200){
                console.log("Authorize successful!!!");
                return response.json()
            }else{
                return Promise.reject(response)
            }
        })
        .then(data => {
            // before redirecting to the host page
            // local store are updated
            if(!sessionStorage.getItem("likedTracks"))sessionStorage.setItem("likedTracks", JSON.stringify([]));
            this.props.updateRoomInfo({
                userName: data.name,
                roomId: data.room_id,
                iniAtLanding: true
            });
            this.props.updatePlaylist(data['tracks'])
            this.props.updateActiveMusicState('STOP')
            this.setRedirect('/host?roomId=' + data.room_id + "&host_name=" + data.name)
        })
        .catch(e=> {
            console.log("Create room failed: " + e);
        });
    }

    joinParty(){
        let id = this.state.inputPartyCode.trim()
        if(id === '')
            return

        api.checkPartyCode(id)
        .then(response => {
            if(response.status !== 200){
                alert('Couldn\'t find party, please try again')
                return Promise.reject(response)
            }
            return response.json()
        })
        .then(data => {
            // before redirecting to the guest page
            // local store are updated
            if(!sessionStorage.getItem("likedTracks"))sessionStorage.setItem("likedTracks", JSON.stringify([]))
            this.props.updateRoomInfo({
                name: data.name,
                roomId: data.room_id,
                iniAtLanding: true
            })
            this.props.updatePlaylist(data['tracks'])
            this.props.updateActiveMusicState('STOP')
            let str = '/guest?roomId=' + data['room_id'] + "&host_name=" + data['name']
            this.setRedirect(str)
        })

        .catch(console.error.bind(this))
    }

    setRedirect = (path) => {
        this.setState({
            redirect: true,
            path: path
        })
    }
    renderRedirect = (path) => {
        if (this.state.redirect) {
            return <Redirect to={this.state.path} />
        }
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

    // checkGuestCode(){
    //     api.checkPartyCode(this.state.input)
    //     .then(response =>{
    //         if (response["status"] == 404){
    //             console.log("login failed!")
    //             this.setState({
    //                 incorrectCode: true
    //             })
    //         }else{
    //             this.setState({
    //                 incorrectCode: false
    //             })

    //         }
    //     })
    // }

    // testPlaylistUpload(){
    //     api.uploadPlayList("12345", data)
    // }


    render(){
        let content;
        if(!this.state.joining && !this.state.displayLogin){
                content = (
                <div className={"landing"}>
                    <button className={`button animateIn main`}
                        onClick={this.create}>
                        CREATE PARTY
                    </button>

                    <button className={`button main`}
                        onClick={this.changeIntention.bind(this)}>
                        <span>JOIN PARTY</span>
                    </button>
                </div>)

        }
        else if(this.state.joining && !this.state.displayLogin){
            content = (
            <div className={"joining"}>
                <div className={"inputArea"}>

                    <button className={"arrow"}
                        onClick={this.changeIntention.bind(this)}>
                        <FaArrowLeft/>
                    </button>

                    <input className={"codeInput"}
                        type={"text"}
                        placeholder={"ENTER CODE"}
                        onChange={this.inputChange.bind(this)}
                    />
                </div>
                <button className={`button animateIn main`}
                    onClick={this.joinParty.bind(this)}>
                    JOIN
                </button>
            </div>)
        }
        else if(this.state.displayLogin){
            content = (
            <div className={"creating"}>
                <button className={"button animateIn main"}
                    onClick={() => this.login()}>
                    LOGIN
                </button>
                <button className={`button animateIn main`}
                    onClick={() => {this.setState({displayLogin: false, joining: true})}}>
                    JOIN PARTY
                </button>
            </div>
            )
        }

        return (

            <div className={"landingPage"}>
                {this.renderRedirect()}
                <img className={"logo"} src={logo} alt={"logo"} />
                {content}
            </div>
        )
    }

    // render2() {
    //     switch (this.state.pagePosition) {
    //         case 0:
    //             return (
    //                 <div className={"landingPage"}>
    //                     <img className={"logo"} src={logo} alt={"logo"} />
    //                     <div className={"landing"}>
    //                         <Button name={"CREATE PARTY"} type={"main"} pos={1} changePagePosition={this.changePagePosition} />
    //                         <Button name={"JOIN PARTY"} type={"main"} pos={2} changePagePosition={this.changePagePosition} />
    //                     </div>
    //                 </div>
    //             );
    //         case 1:
    //             return (
    //                 <div className={"landingPage"}>
    //                     <img className={"logo"} src={logo} alt={"logo"} />
    //                     <div className={"creating"}>
    //                         <Button name={"AUTHORIZING"} type={"main"} pos={0} disable = {true} changePagePosition={this.changePagePosition}/>
    //                         <Button name={"JOIN PARTY"} type={"main"} pos={0} changePagePosition={this.changePagePosition} />
    //                     </div>
    //                 </div>
    //             );
    //         case 2:
    //             return (
    //                 <div className={"landingPage"}>
    //                     <img className={"logo"} src={logo} alt={"logo"} />
    //                     <div className={"joining"}>
    //                         <div className={"inputArea"}>
    //                             <button className={"arrow"} onClick={() => this.changePagePosition(0)}><FaArrowLeft/></button>
    //                             <input className={"codeInput"} type={"text"} placeholder={"ENTER CODE"} />
    //                         </div>
    //                         <Button name={"JOIN"} type={"main"} />
    //                     </div>
    //                 </div>
    //             );
    //         case 3:
    //             return (
    //                 <div className={"landingPage"}>
    //                     <img className={"logo"} src={logo} alt={"logo"} />
    //                     <div className={"joining"}>
    //                         <div className={"login"}>
    //                             <button className={"button animateIn main"} type={"main"} onClick={() => this.login()}> LOGIN </button>
    //                             <Button name={"JOIN PARTY"} type={"main"} pos={0} changePagePosition={this.changePagePosition} />
    //                         </div>
    //                     </div>
    //                 </div>
    //             );
    //         default:
    //             break;
    //     }
    // }
}


const mapDispatchToProps = dispatch => {
    return {
        updateRoomInfo: data => dispatch( updateRoomInfo(data) ),
        updatePlaylist: data => dispatch( updatePlaylist(data) ),
        updateActiveMusicState: data => dispatch( updateActiveMusicState(data) ),
    }
};

export const ReduxLandingPage = connect(null, mapDispatchToProps)(LandingPage);



export default LandingPage;
