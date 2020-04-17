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

let testMusicInfo = [
    {
        name: "Norway Ice",
        album: "Ice 2004",
        icon: "https://1.bp.blogspot.com/-PjjZ8IdgL4o/XFdM0rw8jgI/AAAAAAAAAbA/n5PceMU_W4g2qCkBL--1CN531O15GNQuACLcBGAs/s1600/bandcamp-button-square-green-256.png",
        votes: 6
    },
    {
        name: "spring",
        album: "Kobadouble",
        icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/d5/61/db/d561dba6-9d4f-cd9a-14ac-66ef1c267523/source/256x256bb.jpg",
        votes: 0
    },
    {
        name: "Pop 2099",
        album: "Ice 2006",
        icon: "https://68ef2f69c7787d4078ac-7864ae55ba174c40683f10ab811d9167.ssl.cf1.rackcdn.com/twitter-icon_128x128.png",
        votes: 2
    }
]

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
            <div className={"hostPage"}>
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
                                                <span className={"dot"}>.</span>
                                                <span className={"artist-name"}>
                                                    {item.artistName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={"tracklist"}>
                            {testMusicInfo.map( (entry, index) => {
                                return (
                                    <MusicLi name={entry.name}
                                             album={entry.album}
                                             votes={entry.votes}
                                             icon={entry.icon}
                                             index={index}
                                             key={index}>
                                    </MusicLi>
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