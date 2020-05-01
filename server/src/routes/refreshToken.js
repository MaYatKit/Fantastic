require('dotenv')
    .config();
const Host = require('../models/host');
const querystring = require('querystring');
const syncRequest = require('sync-request');


let refreshToken = async function refreshToken(accessToken, refreshToken) {
    let data = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    };

    let body = querystring.stringify(data);

    let res = syncRequest('POST', 'https://accounts.spotify.com/api/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': body.length,
            'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET)
                .toString('base64')
        },

        body: body
    });
    let response = res.getBody('utf8');

    console.log(response);
    let toJson = JSON.parse(response);
    let newAccessToken = toJson['access_token'];
    let newExpireTime = Math.floor(new Date().getTime() / 1000) + toJson['expires_in'];
    console.log('newAccessToken: ' + newAccessToken);
    console.log('newExpireTime: ' + newExpireTime);


    await Host.findOneAndUpdate({ accessToken: accessToken },
        {
            $set: {
                accessToken: newAccessToken,
                expireTime: Math.floor(new Date().getTime() / 1000) + toJson['expires_in']
            }
        });
    return newAccessToken;
};

module.exports = { refreshToken };
