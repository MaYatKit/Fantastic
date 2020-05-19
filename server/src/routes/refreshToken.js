require('dotenv').config();
const Host = require('../models/host');
const querystring = require('querystring');
const syncRequest = require('sync-request');
const express = require('express');
const router = express.Router();


router.get("/", async (req, res) => {
   
    let data = {
        grant_type: 'refresh_token',
        refresh_token: req.body.refreshToken
    };

    let body = querystring.stringify(data);

    let response = syncRequest('POST', 'https://accounts.spotify.com/api/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': body.length,
            'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET)
            .toString('base64')
        },

        body: body
    });

    if(response.statusCode !== 200) res.status(response.statusCode).json({message: "couldn't refresh accessToken"})
    
    let responseBody = response.getBody('utf8');
    let toJson = JSON.parse(responseBody);
    let newAccessToken = toJson['access_token'];
    let newExpireTime = Math.floor(new Date().getTime() / 1000) + toJson['expires_in'];
    console.log('newAccessToken: ' + newAccessToken);
    console.log('newExpireTime: ' + newExpireTime);

    await Host.findOneAndUpdate({ accessToken: req.body.accessToken },
        {
            $set: {
                accessToken: newAccessToken,
                expireTime: Math.floor(new Date().getTime() / 1000) + toJson['expires_in']
            }
        });

    let responseData = {
        'accessToken': newAccessToken,
        'newExpireTime' : newExpireTime
    }
    res.status(200).json(responseData)
});

module.exports = router;
