import React from 'react';
import SearchBar from './SearchBar';
import './hostPage.css';
import SideBar from './SideBar';
import MusicLi from './MusicLi';
import { connect } from 'react-redux';
import api from '../api'

class ConnectHostPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tracks: [],     // store search result
            active: false,
            userName: this.props.userName,      // should use redux
            roomId: this.props.roomId,
            musicInfo: this.props.musicInfo
        };

        this.GetResult = this.GetResult.bind(this);
        // this.checkState = this.checkState.bind(this);
        // this.checkState();
    }

    checkState() {
        if (this.state.musicInfo === undefined) {
            // after refresh page, need to query data from sever again
        }
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
        api.isLogin().catch(obj => {
            alert("you need log in to see this page")
            api.login();
        })
    }

    render() {
        return (
            <div className={'hostPage'}>
                <SideBar userName={this.state.userName} roomId={this.state.roomId}> </SideBar>
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
                            {this.state.musicInfo[0].map((entry, index) => {
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
        userName: state.userName,
        roomId: state.roomId,

        // existing playlist
        musicInfo: state.musicInfo
    };
};


export const HostPage = connect(mapStateToProps)(ConnectHostPage);


// export default HostPage;
