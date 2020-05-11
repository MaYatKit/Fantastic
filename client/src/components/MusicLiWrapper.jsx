import React from 'react';
import { connect } from 'react-redux'
import MusicLi from './MusicLi'


const mapStateToProps = state => {
    //
    return { "testMusicInfo": state.testMusicInfo };
};

class MusicLiWrapper extends React.Component {


render(){
    return(
    <div style={{marginLeft: "260px"}}>
        {
          this.props.testMusicInfo.map( (entry, index) => {
            return (
              <MusicLi name={entry.name}
                album={entry.album}
                votes={entry.votes}
                icon={entry.icon}
                index={index}
                key={index}>
              </MusicLi>
            )
          })
        }
    </div>
    )
}

}


export default connect(
    mapStateToProps,
    null
)(MusicLiWrapper)