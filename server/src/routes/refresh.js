require('dotenv').config();
const Host = require('../models/host');
const querystring = require('querystring');
const syncRequest = require('sync-request');
const express = require('express');
const router = express.Router();


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

    if(res.status !== 200){ return null }

    let response = res.getBody('utf8');
    let toJson = JSON.parse(response);
    let newAccessToken = toJson['access_token'];
    let newRefreshToken = toJson['refresh_token']; // Sometime refresh_token will return as well
    let newExpireTime = Math.floor(new Date().getTime() / 1000) + toJson['expires_in'];
    console.log('newAccessToken: ' + newAccessToken);
    console.log('newExpireTime: ' + newExpireTime);

    await Host.findOneAndUpdate({ accessToken: accessToken },
        {
            $set: {
                accessToken: newAccessToken,
                expireTime: newExpireTime,
                refreshToken: newRefreshToken===undefined? refreshToken:newRefreshToken
            }
        });
    return newAccessToken;
};


//getTokenByPartyId
router.get("/:partyid", async (req,res,next)=>{
    //Find from database the party id, user name and tracks
    //of a party given the host username.

    await Host.findOne({"party.id": req.params.partyid}).then( async partyExists =>{
        if (partyExists){
            let userInfo = await Host.aggregate([
                { '$match': {  "party.id": req.params.partyid} },
                {
                    '$group': {
                        _id: null,
                        id: { '$first': '$party.id' },
                        name: { '$first': '$name' },
                        accessToken: { '$first': '$accessToken' },
                        refreshToken: { '$first': '$refreshToken' },
                        expireTime: {'$first' : '$expireTime'}
                    }
                },
                {
                    '$project': {
                        id: 1,
                        name: 1,
                        _id: 0,
                        accessToken: 1,
                        refreshToken: 1,
                        expireTime: 1
                    }
                }
            ]);

            if (!userInfo || userInfo.length === 0) {
                res.status(500).json({ message: 'User not found' });
            } else {
                let accessToken = userInfo[0].accessToken;
                let localRefreshToken = userInfo[0].refreshToken;
                let expireTime = userInfo[0].expireTime;

                if (Math.floor(new Date().getTime() / 1000) >= expireTime){
                    console.log("The access token is expired, request a new one now.");
                    accessToken = await refreshToken(accessToken, localRefreshToken);
                    if (!accessToken){
                        res.status(500).json({message: "couldn't refresh token"})
                    }
                }
                let responseData = {
                    'accessToken': accessToken
                };
                res.status(200).json(responseData)
            }
            res.end();
        }else{
            res.status(404).json({message: "couldn't find party"})
        }
    });
});

module.exports =  {
    router : router,
    refreshToken : refreshToken
};
