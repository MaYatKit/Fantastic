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
            play: "PAUSE"   // 'PAUSE' or 'PLAYING'
        };
    }

    handleClick(){
        let nextState;
        if(this.state.play === 'PAUSE')
            nextState = 'PLAYING'
        else if(this.state.play === 'PLAYING')
            nextState = 'PAUSE'

        this.props.playControl(nextState)

        this.setState({play: nextState})
        

    }

    iconFn(){
        if(this.state.play === "PLAYING")
            return (<MdPause className="icon"></MdPause>)
        else if(this.state.play === "PAUSE")
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
