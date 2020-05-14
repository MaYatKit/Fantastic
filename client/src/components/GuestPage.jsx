import React from 'react';
import SearchBar from './SearchBar';
import './hostPage.css';
import SideBar from './SideBar';
import MusicLi from './MusicLi';
import { connect } from 'react-redux';
import api from '../api'
import { readLocalList } from '../redux/actions';

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
    }


    getParamFromUrl(){
        let query = window.location.search.split('&');
        query[0] = query[0].split('?')[1];
        let param = {};
        for (let i = 0; i < query.length; i++) {
            let q = query[i].split('=');
            if (q.length === 2) {
                param[q[0]] = q[1].replace("%20", ' ');
            }
        }
        return param
    }

    GetResult(searchItem) {
        if (searchItem) {
            api.searchItem(searchItem)
            .then(array => {
                console.log("search outcome: ", array)
                this.setState({
                    tracks: array,
                    active: true
                });
            })
        } else {
            this.setState({ tracks: [] });
            this.setState({ active: false });
        }
    }

    componentDidMount(){
        // api.isLogin().catch(obj => {
        //     alert("you need log in to see this page")
        //     api.login();
        // })
        this.props.dispatch( readLocalList() );
        this.render();
    }

    render() {
        return (
            <div className={'hostPage'}>
                <SideBar userName={this.state.userName + '\'s party'}
                    roomId={this.state.roomId}
                    isGuest={true}>
                </SideBar>
                <div style={{ marginLeft: '260px' }}>
                    <SearchBar GetResult={this.GetResult}/>
                    <div className={'page'}>
                        <div className={'search-results ' + (this.state.active ? '' : 'hidden')}>
                            {this.state.tracks.map((item, index) => {
                                return (
                                    <div className={'result'} key={index}>
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
                                    </div>
                                );
                            })}
                        </div>
                        <div className={'tracklist'}>
                            {this.props.musicInfo.map((entry, index) => {
                                return (
                                    <MusicLi name={entry.name}
                                             album={entry.album}
                                             votes={entry.votes}
                                             icon={entry.albumIcon['large']}
                                             index={index}
                                             key={index}>
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
    return {
        // existing playlist
        musicInfo: state.musicInfo
    };
};


export const GuestPage = connect(mapStateToProps)(ConnectGuestPage);

