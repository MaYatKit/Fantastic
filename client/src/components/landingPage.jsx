import React from "react";
import Button from "./button";
import "./landingPage.css";
import api from '../api'

import {FaArrowLeft} from "react-icons/fa";
import logo from "./../image/logo.png"
import { updateRoomInfo, updatePlaylist, updateActiveMusicState } from '../redux/actions'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'


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
        this.create = this.create.bind(this);
        this.login = this.login.bind(this);

    }

    inputChange(event){
        this.setState({
            inputPartyCode: event.target.value,
            incorrectCode: false
        })
    }


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
    }



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
