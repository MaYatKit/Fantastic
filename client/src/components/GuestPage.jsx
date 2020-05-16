import React from 'react';
import SearchBar from './SearchBar';
import './hostPage.css';
import SideBar from './SideBar';
import MusicLi from './MusicLi';
import { connect } from 'react-redux';
import api from '../api';
import { readLocalList, updatePlaylist } from '../redux/actions';
import io from 'socket.io-client';
import { MdAdd } from 'react-icons/md';
import { MdCheck } from 'react-icons/md';


const socket = io('http://localhost:1002');

let needNotify = false;

let likeDict = {};


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

            api.checkPartyCode(this.state.roomId)
                .then(response => {
                    if(response.status !== 200){
                        alert('cannot join');
                        return Promise.reject(response)
                    }
                    return response.json();
                }).then(data => {
                this.props.dispatch(updatePlaylist(data['tracks']));
            }).catch(console.error.bind(this));
        });
    }


    likeStateChanged(index, isLike) {
        console.log('index = ' + index + ', isLike = ' + isLike);
        let newList = Array.from(this.props.musicInfo);
        if (isLike) {
            likeDict[index] = 1;
            newList[index]['votes'] = newList[index]['votes'] + 1;
        } else {
            likeDict[index] = 0;
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
                'play_state': 0,
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
        this.props.dispatch(updatePlaylist(this.props.musicInfo));

        needNotify = true;
    }


    componentDidMount() {
        // api.isLogin().catch(obj => {
        //     alert("you need log in to see this page")
        //     api.login();
        // })
        this.props.dispatch(readLocalList());
        // this.render();
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
                                             liked={likeDict[index] === 1}>
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
        musicInfo: state.musicInfo
    };
};


export const GuestPage = connect(mapStateToProps, null)(ConnectGuestPage);

