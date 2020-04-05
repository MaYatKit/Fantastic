import React from 'react';
import style from "./MusicLi.css"

import PlayBtn from './PlayBtn'



export default class MusicLi extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  musicStateText(props){
    let text = props.votes === 0 ? "Not in Queue" : `${props.votes} votes`;
    return text;
  }

  render(){
    return (
      <div className={"musicli " + (this.props.index % 2 === 0 ? "even" : "")}>
        <div className="img">
            <img src={this.props.icon} alt=""/>
        </div>

        <div className="info">
          <div className="top">
            {this.props.name}
          </div>
          <div className="bottom clearfix">
            <span className="album-name">
            {this.props.album}
            </span>
            <span className="dot">·</span>
            <span className="state">
              {this.musicStateText(this.props)}
            </span>
          </div>
        </div>

        <div className="control">
          <PlayBtn></PlayBtn>
        </div>
      </div>
    );
  }   
}