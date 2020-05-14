import React from "react";
import Button from "./button";
import "./landingPage.css";
import api from '../api'

import {FaArrowLeft} from "react-icons/fa";
import logo from "./../image/logo.png"
import { refreshHostPage, updatePlaylist, updateActiveMusicState } from '../redux/actions'
import { connect } from 'react-redux'

class LandingPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            spotifyLoggedIn: false,
            joining: false,
            inputPartyCode: '',
            pagePosition: 1,
        };
        // this.changePagePosition = this.changePagePosition.bind(this);
        this.create = this.create.bind(this);
        this.login = this.login.bind(this);
    }

    inputChange(event){
        this.setState({
            inputPartyCode: event.target.value
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

    joinParty(){
        let id = this.state.inputPartyCode.trim()
        if(id === '')
            return

        api.getPartyInfo(id)
        .then(response => {
            if(response.status !== 200){
                alert('cannot join')
                return Promise.reject(response)
            }
            return response.json()
        })
        .then(data => {
            this.props.updatePlaylist(data[0].tracks[0])
            this.props.updateActiveMusicState('STOP')

            window.location.href = '/host'
        })
        .catch(console.error.bind(this))
    }

    getPartyInfo(partyId){
        api.getPartyInfo(partyId)
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

    render(){
        let content;
        if(!this.state.joining){
                content = (
                <div className={"landing"}>
                    <button className={`button animateIn main`} 
                        onChange={this.create.bind(this)}>
                        CREATE PARTY
                    </button>

                    <button className={`button main`}
                        onClick={this.changeIntention.bind(this)}>
                        <span>JOIN PARTY</span>
                    </button>
                </div>)
                
        }
        else if(this.state.joining){
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

        return (
            <div className={"landingPage"}>
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
        refreshHostPage: data => dispatch(refreshHostPage(data)),
        updatePlaylist: data => dispatch( updatePlaylist(data) ),
        updateActiveMusicState: data => dispatch( updateActiveMusicState(data) ),
    }
};

export const ReduxLandingPage = connect(null, mapDispatchToProps)(LandingPage);



export default LandingPage;
