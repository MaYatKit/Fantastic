import React from 'react';
import SearchBar from "./SearchBar";
import './hostPage.css';
import SideBar from "./SideBar";
import MusicLi from "./MusicLi";

const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});

window.location.hash = '';
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientId = '38c1268007c94332bec6779dadad7837';
const redirectUri = 'http://localhost:3000';
const scopes = [
    'user-read-email',
    'user-read-private',
];

if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

class HostPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tracks: [],
            active: false
        };

        this.GetResult = this.GetResult.bind(this);
    }

    GetResult(searchItem) {
        if (searchItem) {
            fetch("https://api.spotify.com/v1/search?q=" + searchItem + "&type=track&market=NZ", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + _token
                }
            }).then(data => {
                fetch(data.url)
                    .then(response => response.json())
                    .then((jsonData) => {
                        this.setState({tracks: []});
                        this.setState({active: true});
                        for (let i = 0; i < jsonData.tracks.items.length; i++) {
                            this.setState({tracks: [...this.state.tracks, {trackName: jsonData.tracks.items[i].name, albumName: jsonData.tracks.items[i].album.name, artistName: jsonData.tracks.items[i].artists[0].name, albumArt: jsonData.tracks.items[i].album.images[0].url}]});
                        }
                    });
            });
        } else {
            this.setState({tracks: []});
            this.setState({active: false});
        }
    }

    render() {
        return (
            <div>
                <SideBar username={"test"}> </SideBar>
                <div style={{marginLeft: "260px"}}>
                    <SearchBar GetResult={this.GetResult}/>
                    <div className={"page"}>
                        <div className={"search-results " + (this.state.active ? "" : "hidden")}>
                            {this.state.tracks.map((item, index) => {
                                return (
                                    <div className={"result"} key={index}>
                                        <div className="img">
                                            <img src={item.albumArt} alt=""/>
                                        </div>
                                        <div className={"info"}>
                                            <div className={"top"}>
                                                {item.trackName}
                                            </div>
                                            <div className={"bottom"}>
                                                <span className={"album-name"}>
                                                    {item.albumName}
                                                </span>
                                                <span className={"dot"}>·</span>
                                                <span className={"artist-name"}>
                                                    {item.artistName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default HostPage;