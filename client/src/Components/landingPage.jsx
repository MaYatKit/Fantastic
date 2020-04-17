import React from "react";
import Button from "./button";
import "./landingPage.css";

import {FaArrowLeft} from "react-icons/fa";
import logo from "./../image/logo.png"

class LandingPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pagePosition: 0
        };

        this.changePagePosition = this.changePagePosition.bind(this);
    }

    changePagePosition(pos) {
        this.setState({pagePosition: pos});
    }

    render() {
        switch (this.state.pagePosition) {
            case 0:
                return (
                    <div className={"landingPage"}>
                        <img className={"logo"} src={logo} alt={"logo"} />
                        <div className={"landing"}>
                            <Button name={"CREATE PARTY"} type={"main"} pos={1} changePagePosition={this.changePagePosition} />
                            <Button name={"JOIN PARTY"} type={"secondary"} pos={2} changePagePosition={this.changePagePosition} />
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className={"landingPage"}>
                        <img className={"logo"} src={logo} alt={"logo"} />
                        <div className={"creating"}>
                            <Button name={"clicked"} type={"main"} pos={0} changePagePosition={this.changePagePosition}/>
                            <Button name={"JOIN PARTY"} type={"secondary"} pos={0} changePagePosition={this.changePagePosition} />
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
                            <Button name={"JOIN"} type={"secondary"} />
                        </div>
                    </div>
                );
            default:
                break;
        }
    }
}

export default LandingPage;