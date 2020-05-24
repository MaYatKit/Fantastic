import React from 'react';

import style from "./MliBtns.css"

// import icons
import { MdPlayArrow } from "react-icons/md";
import { MdPause } from "react-icons/md";

// all possible states

export default class PlayBtn extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleClick(){

        if(this.props.disabled)
            return
        this.props.playControl()

    }

    iconFn(){
        if(this.props.playState === "PLAYING")
            return (<MdPause className="icon"></MdPause>);
        else if(this.props.playState === "PAUSE" || this.props.playState === 'STOP')
            return (<MdPlayArrow className="icon"></MdPlayArrow>);
    }

    render(){
        return (
            <div className={"playbtn " + (this.props.disabled ? 'disabled' : '')}
                onClick={this.handleClick.bind(this)}>
                { this.iconFn() }
            </div>
        );
    }
}
