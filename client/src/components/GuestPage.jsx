import React from 'react';
import SearchBar from './SearchBar';
import './hostPage.css';
import SideBar from './SideBar';
import MusicLi from './MusicLi';
import { connect } from 'react-redux';
import api from '../api';
import {updatePlaylist,
    play,
    pause,
    updateRoomInfo,
    updateActiveMusic,
    restoreDefault,
    updateActiveMusicState 
} from '../redux/actions';
import io from 'socket.io-client';
import { MdAdd } from 'react-icons/md';
import { MdCheck } from 'react-icons/md';


const socket = io('http://localhost:1002');

let needNotify = false;


class ConnectGuestPage extends React.Component {
    constructor(props) {
        super(props);
        this.getParamFromUrl = this.getParamFromUrl.bind(this);

        let param = this.getParamFromUrl();
        this.state = {
            tracks: [],     // store search result
            active: false,
            userName: param['host_name'],      // should use redux
            roomId: param['roomId'],
            musicInfo: this.props.musicInfo
        };

        this.GetResult = this.GetResult.bind(this);
        this.searchRef = React.createRef();
        this.initWs = this.initWs.bind(this);
        this.initWs();
    }


    getParamFromUrl() {
        if (window.location.search === '') {
            window.location.href = '/';
        }
        let query = window.location.search.split('&');
        query[0] = query[0].split('?')[1];
        let param = {};
        for (let i = 0; i < query.length; i++) {
            let q = query[i].split('=');
            if (q.length === 2) {
                param[q[0]] = q[1].replace('%20', ' ');
            }
        }
        return param;
    }

    initWs() {

        socket.on('refresh_play_list', () => {
            console.log('Guest: refresh_play_list received!!');
            this.clientRequestData()
            .then(data => {
                this.props.dispatch(updatePlaylist(data['tracks']));
            }).catch(console.error.bind(this));
        });
    }

    clientRequestData(){
        return api.checkPartyCode(this.state.roomId)
        .then(response => {
            if(response.status !== 200){
                alert('cannot join');
                return Promise.reject(response)
            }
            return response.json();
        })
    }

    likeStateChanged(index, isLike) {
        let newList = Array.from(this.props.musicInfo);
        if (isLike) {
            this.addTrackToLiked(newList[index].uri)
            newList[index]['votes'] = newList[index]['votes'] + 1;
        } else {
            this.removeTrackFromLiked(newList[index].uri)
            newList[index]['votes'] = newList[index]['votes'] - 1;
        }
        this.props.dispatch(updatePlaylist(this.props.musicInfo));
        needNotify = true;
    }


    GetResult(searchItem) {
        if (searchItem) {
            api.searchItem(searchItem)
                .then(array => {
                    console.log('search outcome: ', array);
                    this.setState({
                        tracks: array,
                        active: true
                    });
                });
        } else {
            this.setState({ tracks: [] });
            this.setState({ active: false });
        }
    }

    selectSearchItem(item) {
        let musicInfoCopy = Array.from(this.props.musicInfo)
        let i = musicInfoCopy.findIndex(e => e.uri === item.uri)
        if(i !== -1){
            let liked = this.trackIsLiked(musicInfoCopy[i].uri)
            if (liked) {
                this.removeTrackFromLiked(musicInfoCopy[i].uri)
                musicInfoCopy[i].votes -= 1
                item.selected = false
                alert("This song already in the queue, you just **unvoted**")
            }
            else {
                this.addTrackToLiked(musicInfoCopy[i].uri)
                musicInfoCopy[i].votes += 1
                item.selected = true
                alert("This song already in the queue, you just **voted**")
            }
        }else{
                musicInfoCopy.push({
                    'play_state': 0,
                    'votes': 0,
                    'name': item['trackName'],
                    'uri': item['uri'],
                    'artist': item['artistName'],
                    'album': item['albumName'],
                    'albumIcon': {
                        'small': item.albumIcon['small'].url,
                        'large': item.albumIcon['large'].url
                    }
                })
                item.selected = true
            }
            this.props.dispatch(updatePlaylist(musicInfoCopy));
            needNotify = true;
        }


    componentDidMount() {
        if(this.props.iniAtLanding)
            return

        // refresh page at path /guest
        if(!this.state.roomId){
            return alert("please go back to landing page")
        }

        this.clientRequestData()
        .then(data => {
            this.props.dispatch( updateRoomInfo({
                userName: data.name,
                roomId: data.room_id,
                iniAtLanding: false
            }) )
            this.props.dispatch(updatePlaylist(data['tracks']));
        })
    }

    componentWillUnmount(){
        socket.close()
        this.props.dispatch(restoreDefault())
    }

    removeTrackFromLiked(trackUri){
        let likedTracks = JSON.parse(sessionStorage.getItem("likedTracks"))
        let indexOfTrack = likedTracks.indexOf(trackUri)
        if(indexOfTrack !== -1) likedTracks.splice(indexOfTrack, 1)
        sessionStorage.setItem("likedTracks", JSON.stringify(likedTracks))
    }

    addTrackToLiked(trackUri){
        let likedTracks=JSON.parse(sessionStorage.getItem("likedTracks"))
        likedTracks.push(trackUri)
        sessionStorage.setItem("likedTracks", JSON.stringify(likedTracks))
    }

    trackIsLiked(trackUri){
        let likedTracks=JSON.parse(sessionStorage.getItem("likedTracks"))
        let indexOfTrack = likedTracks.indexOf(trackUri)
        if(indexOfTrack === -1) return false
        return true
    }

    render() {
        return (
            <div className={'hostPage'}>

                <SideBar userName={this.state.userName + '\'s party'}
                         roomId={this.state.roomId}
                         isGuest={true}>
                </SideBar>

                <div className={'content_container'}>
                    <SearchBar GetResult={this.GetResult} ref={this.searchRef}/>
                    
                    <div className={'page'}>
                        <div className={'search-results ' + (this.state.active ? '' : 'hidden') } onClick={() => {
                            this.setState({ active: false });
                            this.searchRef.current.state.searching = false;
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
                            {this.props.musicInfo.map((entry, index) => {
                                return (//todo Need to sort by votes, only sort from the second song
                                    <MusicLi name={entry.name}
                                             playState = {entry.play_state}
                                             album={entry.album}
                                             votes={entry.votes}
                                             icon={entry.albumIcon['large']}
                                             index={index}
                                             key={index}
                                             isGuest = {true}
                                             clickLike={this.likeStateChanged.bind(this)}
                                             liked={this.trackIsLiked(entry.uri)}>
                                    </MusicLi>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    api.uploadPlayList(state.roomId, state.musicInfo, () => {
        if (needNotify) {
            socket.emit('change_request', (data) => {
                // callback
                console.log('server responded: ', data);
            });
            needNotify = false;
        }
    });
    return {
        // existing playlist
        musicInfo: state.musicInfo,
        iniAtLanding: state.iniAtLanding
    };
};


export const GuestPage = connect(mapStateToProps, null)(ConnectGuestPage);

