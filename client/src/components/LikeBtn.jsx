import React from 'react';

import style from "./MliBtns.css"

// import icons

import {FiPlus} from "react-icons/fi"
import {MdFavorite} from "react-icons/md"
import {MdFavoriteBorder} from "react-icons/md"

// all possible states
// const s = ["NOT_IN_QUEUE", "LIKED", "NOT_LIKE"];

export default class MusicLi extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      play: "NOT_IN_QUEUE"
    };

    // https://stackoverflow.com/questions/33973648/react-this-is-undefined-inside-a-component-function
    this.clickHdl = this.clickHdl.bind(this);
  }

  clickHdl(event){
    if(this.state.play == "NOT_IN_QUEUE")
      return this.setState({
        play: "LIKED"
      })

    let next = this.state.play === "LIKED" ? "NOT_LIKE" : "LIKED";
    this.setState({
      play: next
    })
  }

  iconFn(){
    if(this.state.play == "NOT_IN_QUEUE")
      return (<FiPlus className="icon"></FiPlus>)
    else if (this.state.play == "LIKED")
      return (<MdFavorite className="icon"></MdFavorite>)
    else
      return (<MdFavoriteBorder className="icon"></MdFavoriteBorder>)
  }

  render(){
    return (
      <div className="likebtn" onClick={this.clickHdl}>
        { this.iconFn() }
      </div>
    );
  }   
}
