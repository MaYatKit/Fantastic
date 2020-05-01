const express = require('express');
const router = express.Router();
const Host = require('../models/host');
const re = require('./refreshToken');
const syncRequest = require('sync-request');


router.get('/', async (req, res) => {
    try {
        //Find from database the party id, user name and tracks
        //of a party given the host username.
        let userInfo = await Host.aggregate([
            { '$match': { id: req.cookies.user } },
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
            res.status(500).json({ message: 'Hasn\'t login' });
        } else {
            let searchType = req.query.type;
            let searchLimit = req.query.limit;
            let searchText = req.query.q;
            let partyId = userInfo[0].id;
            let userName = userInfo[0].name;
            let accessToken = userInfo[0].accessToken;
            let refreshToken = userInfo[0].refreshToken;
            let expireTime = userInfo[0].expireTime;



            // if (Math.floor(new Date().getTime() / 1000) >= expireTime){
                console.log("The access token is expired, request a new one now.");
                accessToken = await re.refreshToken(accessToken, refreshToken);
            // }


            let searchRes = syncRequest('GET', 'https://api.spotify.com/v1/search?q=' + searchText + '&type=' + searchType + '&limit=' + searchLimit, {
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + accessToken
                }
            });

            if(searchRes.statusCode === 200){
                let response = searchRes.getBody('utf8');
                let jsonResult = JSON.parse(response);
                res.status(200).json(jsonResult);
                res.end();
            }else {
                throw new Error("Search tracks failed!!!")
            }
        }
        res.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
        res.end();
    }
});

module.exports = router;
