import React from 'react';
import oauth from './oauth'

// // Get the hash of the url
// const hash = window.location.hash
//     .substring(1)
//     .split('&')
//     .reduce(function (initial, item) {
//         if (item) {
//             var parts = item.split('=');
//             initial[parts[0]] = decodeURIComponent(parts[1]);
//         }
//         return initial;
//     }, {});

// // window.location.hash = '';
// // Set token
// let _token = hash.access_token;
// // let _token = "BQCY5qSxEJavbkrJA5hOEtjeTDCFG3hw9B2ym3nsgCdWccGyZyq2J9LiMoDsHIPLG1w84737qpGudOMkrgwng64-9nOaC-zALESpjxxLW6WZEk0b1L80CbPvaiYa2EC-wR_FDhcU3LvYYAM_IzxRbiqrEC4ZCTjj4PXOQ9UTBBtFTzmaRsBVz1E";

// const authEndpoint = 'https://accounts.spotify.com/authorize';

// // Replace with your app's client ID, redirect URI and desired scopes
// const clientId = '38c1268007c94332bec6779dadad7837';
// const redirectUri = 'http://localhost:3000';
// const scopes = [
//     'streaming',
//     'user-read-email',
//     'user-read-private',
//     'user-modify-playback-state'
// ];

// // If there is no token, redirect to Spotify authorization
// if (!_token) {
//     window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
// }

let _token = "";
let readyToPlay = false;
let deviceId = 0;

let playing = false;


export function init() {
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
            play(device_id);
        });
        player.on('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.connect()
            .then(success => {
                if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            });
    };
}

export function isPlaying() {
    return playing;
}

export function playSong(songList) {
    if (!readyToPlay) {
        return '!readyToPlay!!!';
    }
    if (!songList) {
        return '!songList!!!';
    }

    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _token
        },
        body: JSON.stringify({ 'uris': songList })
    })
        .then(response => {
            console.log('Player response: ' + response.url + ', status = ' + response.status);
        });

}

export function pause() {
    if (!readyToPlay) {
        return '!readyToPlay!!!';
    }
    fetch('https://api.spotify.com/v1/me/player/pause?device_id=' + deviceId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _token
        }
    })
        .then(response => {
            console.log('Player response: ' + response.url + ', status = ' + response.status);
            if (response.status === 204) {
                playing = false;
            }
        });

}

export function resume() {
    if (!readyToPlay) {
        return '!readyToPlay!!!';
    }
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _token
        }
    })
        .then(response => {
            console.log('Player response: ' + response.url + ', status = ' + response.status);
            if (response.status === 204) {
                playing = true;
            }
        });

}

export function next() {
    if (!readyToPlay) {
        return '!readyToPlay!!!';
    }
    fetch('https://api.spotify.com/v1/me/player/next?device_id=' + deviceId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _token
        }
    })
        .then(response => {
            console.log('Player response: ' + response.url + ', status = ' + response.status);
            if (response.status === 204) {
                playing = true;
            }
        });
}

// Play a specified track on the Web Playback SDK's device ID
function play(device_id) {
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + device_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _token
        },
        body: JSON.stringify({ 'uris': ['spotify:track:2eSNpIOFoi1Q8wxw6CycXJ', 'spotify:track:5HG4ivhRHPuO0f8u7zocjw'] })
    })
        .then(response => {
            console.log('Player response: ' + response.url + ', status = ' + response.status);
            if (response.status === 204) {
                playing = true;
            }
        });
}
