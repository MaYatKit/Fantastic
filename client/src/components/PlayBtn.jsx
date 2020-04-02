import React from 'react';

import style from "./PlayBtn.css"

// import icons
import { MdPlayArrow } from "react-icons/md";
import { MdPause } from "react-icons/md";

// all possible states
// const s = ["DISABLED", "PLAYING", "PAUSE"];

export default class MusicLi extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      play: "PAUSE"
    };

    // https://stackoverflow.com/questions/33973648/react-this-is-undefined-inside-a-component-function
    this.clickHdl = this.clickHdl.bind(this);
  }

  clickHdl(event){
    if(this.state.play == "DISABLED")
      return;

    let next = this.state.play == "PLAYING" ? "PAUSE" : "PLAYING";
    this.setState({
      play: next
    })
  }

  iconFn(){
    if(this.state.play == "PLAYING")
      return (<MdPause className="icon"></MdPause>)
    else
      return (<MdPlayArrow className="icon"></MdPlayArrow>)
  }

  render(){
    return (
      <div className="playbtn" onClick={this.clickHdl}>
        { this.iconFn() }
      </div>
    );
  }   
}
