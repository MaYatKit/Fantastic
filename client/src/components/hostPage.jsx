import React from 'react';
import SearchBar from './SearchBar';
import './hostPage.css';
import SideBar from './SideBar';
import MusicLi from './MusicLi';
import { connect } from 'react-redux';
import api from '../api';
import { MdAdd } from 'react-icons/md';
import { MdCheck } from 'react-icons/md';
import {updatePlaylist, refreshPlaylist, play, pause} from '../redux/actions';


class ConnectHostPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tracks: [],     // store search result
            active: false,
            // userName: this.props.userName,
            // roomId: this.props.roomId,
            // musicInfo: this.props.musicInfo
        };

        this.GetResult = this.GetResult.bind(this);
        this.searchRef = React.createRef();
    }



    playControl(uri, nextState){
        // nextState: 'PAUSE' or 'PLAYING'
        if (nextState === 'PAUSE'){
            return this.props.dispatch( pause(uri) )
        }

        else if(nextState === 'PLAYING'){
            return this.props.dispatch( play(uri) )
        }
    }

    playNext(){
        if(this.props.musicInfo.length < 2){
            alert("you can't play next when there is only one")
            return;
        }

        let prevUri = this.props.activeMusicUri
        let nextUri = this.props.musicInfo[1].uri
        let newMusicInfo = this.props.musicInfo

        this.playControl(nextUri, 'PLAYING')
        .then(response => {
            let oldIndex = newMusicInfo.findIndex(e => e.uri === prevUri)
            newMusicInfo.splice(oldIndex, 1)
            this.props.dispatch( updatePlaylist(newMusicInfo) )
        })
    }

    removeAMusic(uri){
        // remove a music that is not being played
        let newMusicInfo = this.props.musicInfo;
        let i = newMusicInfo.findIndex(e => e.uri === uri);
        newMusicInfo.splice(i, 1);
        this.props.dispatch( updatePlaylist(newMusicInfo) );
    }

    GetResult(searchItem) {
        if (searchItem) {
            api.searchItem(searchItem)
                .then(array => {
                    if (this.searchRef.current.state.searching) {
                        console.log('search outcome: ', array);
                        this.setState({
                            tracks: array,
                            active: true
                        });
                    }
                });
        } else {
            this.setState({ tracks: [] });
            this.setState({ active: false });
        }
    }

    // componentDidMount() {
    //     api.isLogin()
    //         .catch(obj => {
    //             alert('you need log in to see this page');
    //             api.login();
    //         });
    // }


    selectSearchItem(item) {
        if (item.selected) {
            item.selected = false;
            for (let i = 0; i < this.props.musicInfo.length; i++) {
                if (this.props.musicInfo[i]['_id'] === item['id']) {
                    this.props.musicInfo.splice(i, 1);
                    break;
                }
            }

        } else {
            item.selected = true;
            this.props.musicInfo[this.props.musicInfo.length] = {
                'votes': 1,
                'name': item['trackName'],
                'uri': item['uri'],
                'artist': item['artistName'],
                'album': item['albumName'],
                'albumIcon': {
                    'small': item.albumIcon['small'].url,
                    'large': item.albumIcon['large'].url
                }
            };
        }
        this.props.dispatch( updatePlaylist(this.props.musicInfo) )
        // this.setState({
        //     tracks: this.state.tracks,
        //     active: true,
        //     musicInfo: this.state.musicInfo
        // });
    }

    render() {
        return (
            <div className={'hostPage'}>
                <SideBar userName={this.props.userName} roomId={this.props.roomId}> </SideBar>
                <div style={{ marginLeft: '260px' }}>
                    <SearchBar GetResult={this.GetResult} ref={this.searchRef}/>
                    <div className={'page'}>
                        <div className={'search-results ' + (this.state.active ? '' : 'hidden')}
                             onClick={() => {
                                 this.setState({ active: false });
                                 this.searchRef.current.state.searching = false;
                                 // this.savePlaylist();
                             }}>
                            {this.state.tracks.map((item, index) => {
                                return (
                                    <div className={'result'} key={index} onClick={event => {
                                        this.selectSearchItem(item);
                                        event.stopPropagation();
                                    }}>
                                        <div className="img">
                                            <img src={item.albumArt} alt=""/>
                                        </div>
                                        <div className={'info'}>
                                            <div className={'top'}>
                                                {item.trackName}
                                            </div>
                                            <div className={'bottom'}>
                                                <span className={'album-name'}>
                                                    {item.albumName}
                                                </span>
                                                <span className={'dot'}>.</span>
                                                <span className={'artist-name'}>
                                                    {item.artistName}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={'addSong'} onClick={event => {
                                            this.selectSearchItem(item);
                                            event.stopPropagation();
                                        }}>
                                            {item.selected ?
                                                <MdCheck className={'icon'}> </MdCheck> :
                                                <MdAdd className={'icon'}>
                                                </MdAdd>}
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                        <div className={'tracklist'}>
                            {
                                this.props.musicInfo.length !== 0 ? this.props.musicInfo.map((entry, index) => {
                                    return (
                                        <MusicLi name={entry.name}
                                                 album={entry.album}
                                                 votes={entry.votes}
                                                 icon={entry.albumIcon['large']}
                                                 uri = {entry.uri}
                                                 activeMusicUri = {this.props.activeMusicUri}
                                                 playControl = {this.playControl.bind(this)}
                                                 playNext = {this.playNext.bind(this)}
                                                 removeAMusic = {this.removeAMusic.bind(this)}
                                                 index={index}
                                                 key={entry.uri}>
                                        </MusicLi>
                                    );
                                }) : <span className={'hint'}> Search to add musics </span>
                                // console.log(this.props.musicInfo)
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    api.uploadPlayList(state.roomId, state.musicInfo);
    return {
        userName: state.userName,
        roomId: state.roomId,

        // existing playlist
        musicInfo: state.musicInfo,
        activeMusicUri: state.activeMusicUri
    };
};


// const mapDispatchToProps = dispatch => {
//     return {
//         refreshPlaylist: data => dispatch( refreshPlaylist(data) ),
//         play: data => dispatch( play(data) ),
//     };
// };


export const HostPage = connect(mapStateToProps, null)(ConnectHostPage);


// export default HostPage;
