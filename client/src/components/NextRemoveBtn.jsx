import React from 'react';

import style from "./MliBtns.css"

// import icons

import {MdSkipNext} from "react-icons/md"
import {MdClear} from "react-icons/md"

// all possible states
// const s = ["REMOVE", "NEXT"];

export default class MusicLi extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      play: "REMOVE"
    };

    // https://stackoverflow.com/questions/33973648/react-this-is-undefined-inside-a-component-function
    this.clickHdl = this.clickHdl.bind(this);
  }

  clickHdl(event){

    let next = this.state.play === "REMOVE" ? "NEXT" : "REMOVE";
    this.setState({
      play: next
    })
  }

  iconFn(){
    if(this.state.play == "REMOVE")
      return (<MdSkipNext className="icon"></MdSkipNext>)
    else
      return (<MdClear className="icon"></MdClear>)
  }

  render(){
    return (
      <div className="likebtn" onClick={this.clickHdl}>
        { this.iconFn() }
      </div>
    );
  }   
}
