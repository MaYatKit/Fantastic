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

    getLikeArray(){
        let likeArray = JSON.parse(sessionStorage.getItem("likeArray"))
        if(Array.isArray(likeArray)) 
            return likeArray
        likeArray = this.props.musicInfo.map(e => {
            return 0
        })
        sessionStorage.setItem("likeArray",JSON.stringify(likeArray))
        return likeArray
    }

    likeStateChanged(index, isLike) {
        let newList = Array.from(this.props.musicInfo);
        if (isLike) {
            newList[index]['votes'] = newList[index]['votes'] + 1;
            this.updateLikes(index, 1)
        } else {
            newList[index]['votes'] = newList[index]['votes'] - 1;
            this.updateLikes(index, 0)
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
        let likeArray = this.getLikeArray()

        let itemInPlaylist = i !== -1
        let index_out = i > likeArray.length 
        let liked = false
        if (!index_out) // may throw error if use condition expr
            liked = likeArray[i] > 0

        if (itemInPlaylist && liked) {
            this.removeLikeIndex(i)
            musicInfoCopy[i].votes -= 1
            item.selected = false
            alert("this song already in list, you just **unvoted**")
        }
        else if(itemInPlaylist && !liked){
            this.updateLikes(i, 1)
            musicInfoCopy[i].votes += 1
            item.selected = true
            alert("this song already in list, you just **voted**")
        }
        else if(!itemInPlaylist){
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
            this.updateLikes(musicInfoCopy.length, 0)
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

    updateLikes(index, value){
        let updatedLikeArray =JSON.parse(sessionStorage.getItem("likeArray"))
        updatedLikeArray[index] = value
        sessionStorage.setItem("likeArray",JSON.stringify(updatedLikeArray))
    }

    removeLikeIndex(index){
        let newLikeArray = JSON.parse(sessionStorage.getItem("likeArray"))
        newLikeArray.splice(index,1)
        sessionStorage.setItem("likeArray", JSON.stringify(newLikeArray))
    }

    render() {
        return (
            <div className={'hostPage'}>
                <SideBar userName={this.state.userName + '\'s party'}
                         roomId={this.state.roomId}
                         isGuest={true}>
                </SideBar>
                <div style={{ marginLeft: '260px' }}>
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
                                             album={entry.album}
                                             votes={entry.votes}
                                             icon={entry.albumIcon['large']}
                                             index={index}
                                             key={index}
                                             isGuest = {true}
                                             clickLike={this.likeStateChanged.bind(this)}
                                             liked={JSON.parse(sessionStorage.getItem("likeArray"))[index] === 1}>
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

