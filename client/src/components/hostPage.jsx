import React from 'react';
import SearchBar from './SearchBar';
import './hostPage.css';
import SideBar from './SideBar';
import MusicLi from './MusicLi';
import { connect } from 'react-redux';
import api from '../api';
import { MdAdd } from 'react-icons/md';
import { MdCheck } from 'react-icons/md';
import {refreshPlaylist, play, pause} from '../redux/actions';


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
        this.savePlaylist = this.savePlaylist.bind(this);
    }

    savePlaylist() {
        if (this.state.musicInfo.length !== 0) {
            // this.props.refreshPlaylist(this.state.musicInfo);
            this.props.dispatch( refreshPlaylist(this.state.musicInfo) )
        }
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

    componentDidMount() {
        api.isLogin()
            .catch(obj => {
                alert('you need log in to see this page');
                api.login();
            });
    }


    selectSearchItem(item) {
        if (item.selected) {
            item.selected = false;
            for (let i = 0; i < this.state.musicInfo.length; i++) {
                if (this.state.musicInfo[i]['_id'] === item['id']) {
                    this.state.musicInfo.splice(i, 1);
                    break;
                }
            }

        } else {
            item.selected = true;
            this.state.musicInfo[this.state.musicInfo.length] = {
                'votes': 1,
                '_id': item['id'],
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
        this.setState({
            tracks: this.state.tracks,
            active: true,
            musicInfo: this.state.musicInfo
        });
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
                                 this.savePlaylist();
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
                                this.props.musicInfo.length !== 0 ? this.props.musicInfo[0].map((entry, index) => {
                                    return (
                                        <MusicLi name={entry.name}
                                                 album={entry.album}
                                                 votes={entry.votes}
                                                 icon={entry.albumIcon['large']}
                                                 uri = {entry.uri}
                                                 playControl = {this.playControl.bind(this)}
                                                 index={index}
                                                 key={index}>
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
    return {
        userName: state.userName,
        roomId: state.roomId,

        // existing playlist
        musicInfo: state.musicInfo ? state.musicInfo : []
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
