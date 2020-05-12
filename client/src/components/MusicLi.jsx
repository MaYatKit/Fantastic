import React from 'react';
import "./MusicLi.css"
import PlayBtn from './PlayBtn'
import NextRemoveBtn from './NextRemoveBtn'
import { connect } from 'react-redux';

class MusicLi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    musicStateText(props){
        let text = props.votes === 0 ? "Not in Queue" : `${props.votes} votes`;
        return text;
    }

    IsActive(){
        return this.props.uri === this.props.activeMusicUri
    }

    playControlMli(info){
        // stop/pause -> playing
        // playing -> pause

        if(!this.IsActive())
            // control button only appear in the topmost music
            return
        let nextState, resume
        let uri = this.props.uri
        let s = this.props.activeMusicState

        if(s === 'PAUSE' || s === 'STOP')
            nextState = 'PLAYING'
        else if(s === 'PLAYING')
            nextState = 'PAUSE'

        resume = (s !== 'STOP')

        this.props.playControl({uri, nextState, resume})
    }

    nextOrRemove(type){
        if(type === 'NEXT'){
            this.props.playNext()
        }else if(type === 'REMOVE'){
            this.props.removeAMusic(this.props.uri)
        }
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
                <span className="dot">.</span>
                <span className="state">
                {this.musicStateText(this.props)}
                </span>
            </div>
            </div>

            <div className="control">
                

                {
                    this.props.uri === this.props.activeMusicUri ?
                    <PlayBtn playControl={this.playControlMli.bind(this)}
                        playState={this.props.activeMusicState}>                           
                    </PlayBtn> 
                    : ''
                }

                {
                    this.props.uri === this.props.activeMusicUri ?
                    <NextRemoveBtn type={'NEXT'} 
                        parentHandler={this.nextOrRemove.bind(this)}>
                    </NextRemoveBtn> :
                    <NextRemoveBtn type={'REMOVE'}
                        parentHandler={this.nextOrRemove.bind(this)}>
                    </NextRemoveBtn>
                }
            </div>
        </div>
        );
    }   
}

const mapStateToProps = (state, ownProps) => {

    return {
        musicInfo: state.musicInfo,
        activeMusicUri: state.activeMusicUri,
        activeMusicState: state.activeMusicState
    };
};

export default connect(mapStateToProps, null)(MusicLi)