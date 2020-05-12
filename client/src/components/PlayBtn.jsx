import React from 'react';

import style from "./MliBtns.css"

// import icons
import { MdPlayArrow } from "react-icons/md";
import { MdPause } from "react-icons/md";

// all possible states
// const s = ["DISABLED", "PLAYING", "PAUSE"];

export default class MusicLi extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            // play: "PAUSE"   // 'PAUSE' or 'PLAYING'
        };
    }

    handleClick(){
        // let nextState;
        // let resume = this.props.playState !== 'STOP'
        // if(this.props.playState === 'PAUSE' || this.props.playState === 'STOP')
        //     nextState = 'PLAYING'
        // else if(this.props.playState === 'PLAYING')
        //     nextState = 'PAUSE'

        // this.props.playControl({nextState, resume})
        this.props.playControl()

    }

    iconFn(){
        if(this.props.playState === "PLAYING")
            return (<MdPause className="icon"></MdPause>)
        else if(this.props.playState === "PAUSE" || this.props.playState === 'STOP')
            return (<MdPlayArrow className="icon"></MdPlayArrow>)
    }

    render(){
        return (
            <div className="playbtn" onClick={this.handleClick.bind(this)}>
                { this.iconFn() }
            </div>
        );
    }
}
