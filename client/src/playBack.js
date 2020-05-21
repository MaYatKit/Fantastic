import oauth from './oauth';
const syncRequest = require('sync-request');


let _token = 'oauth.getToken()';
let readyToPlay = false;
let deviceId = null;
let _partyId  = null;


function insertTag() {

    var my_awesome_script = document.createElement('script');

    my_awesome_script.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js');

    document.head.appendChild(my_awesome_script);
}


function getTokenFromServer(partyId) {
    _partyId = partyId;

    let response = syncRequest('GET', 'http://localhost:1000/refresh/' + partyId, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    if(response.statusCode !== 200) {
        console.log('Fail to get token!!! status code = ' + response['status']);
        return
    }

    let responseBody = response.getBody('utf8');
    let toJson = JSON.parse(responseBody);
    _token = toJson['accessToken'];
    init();
}


function init() {
    window.onSpotifyWebPlaybackSDKReady = () => {
        // const token = 'BQAqrWNV5yfJfQ-IZd-WPjgf3hbYVlj0S6GKtiNCgPUBpvf3ylsgywDLQOpN-fg4UvHzu5MlZqMKdNz5dTptSPeGC9wtZ_TLAi_PiOBMQ1IP6v1lyUUUJsKlE6lHWHOiTXwAWOV7o8P2gen620Q_XUdC430z4UnizfCH_49ZRHBL09ej6oBG_7I';
        // eslint-disable-next-line
        const player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: (cb) => {
                console.log('Start a new player, token: ', _token);
                cb(_token);
            },
        });

        player.on('initialization_error', ({ message }) => {
            console.error(message);
        });
        player.on('authentication_error', ({ message }) => {
            console.error(message);
        });
        player.on('account_error', ({ message }) => {
            console.error(message);
        });
        player.on('playback_error', ({ message }) => {
            console.error(message);
        });


        player.on('player_state_changed', (state) => {
            console.log('Player state changed', state);
        });
        player.on('ready', ({ device_id }) => {
            // Connect to the player!
            console.log('Ready with Device ID', device_id);
            readyToPlay = true;
            deviceId = device_id;
        });
        player.on('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.connect()
            .then(success => {
                if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            })
            .catch(console.error);
    };

    insertTag();
}


// export function playSong(songList) {
//     if (!readyToPlay) {
//         return '!readyToPlay!!!';
//     }
//     if (!songList) {
//         return '!songList!!!';
//     }

//     fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + _token
//         },
//         body: JSON.stringify({ 'uris': songList })
//     })
//         .then(response => {
//             console.log('Player response: ' + response.url + ', status = ' + response.status);
//         });

// }

async function pause() {
    if (!readyToPlay) {
        return '!readyToPlay!!!';
    }
    console.log('pause');


    let response = null;

    try{
        response = await fetch('https://api.spotify.com/v1/me/player/pause?device_id=' + deviceId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            }
        });
    }catch (e) {
        getTokenFromServer(_partyId);
        response = await fetch('https://api.spotify.com/v1/me/player/pause?device_id=' + deviceId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            }
        });
    }
    return response;

}

async function resume() {
    if (!readyToPlay) {
        return '!readyToPlay!!!';
    }
    console.log('resume');

    let response = null;

    try{
        response = await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            }
        });
    }catch (e) {
        getTokenFromServer(_partyId);
        response = await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            }
        });
    }

    return response;
}

// function next() {
//     if (!readyToPlay) {
//         return '!readyToPlay!!!';
//     }
//     fetch('https://api.spotify.com/v1/me/player/next?device_id=' + deviceId, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + _token
//         }
//     })
//         .then(response => {
//             console.log('Player response: ' + response.url + ', status = ' + response.status);
//             if (response.status === 204) {
//                 // playing = true;
//             }
//         });
// }

// Play a specified track on the Web Playback SDK's device ID
async function  play(uri)  {
    // ['spotify:track:2eSNpIOFoi1Q8wxw6CycXJ', 'spotify:track:5HG4ivhRHPuO0f8u7zocjw']
    console.log('play');
    if (!readyToPlay) {
        return Promise.reject('device not ready');
    }
    let response = null;

    try{
        response = await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            },
            body: JSON.stringify({ 'uris': [uri] })
        });
    }catch (e) {
        getTokenFromServer(_partyId);
        response = await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            },
            body: JSON.stringify({ 'uris': [uri] })
        });
    }
    return response;
}


export default {
    init,
    play,
    pause,
    resume,
    getTokenFromServer
}
