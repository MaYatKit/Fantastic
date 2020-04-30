const express = require('express');
const router = express.Router();
const Host = require('../models/host');
const fetch = require('node-fetch');


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
                    refreshToken: { '$first': '$refreshToken' }
                }
            },
            {
                '$project': {
                    id: 1,
                    name: 1,
                    _id: 0,
                    accessToken: 1,
                    refreshToken: 1
                }
            }
        ]);

        if (!userInfo || userInfo.length === 0) {
            res.status(500)
                .json({ message: 'Hasn\'t login' });
        } else {
            let searchType = req.query.type;
            let searchLimit = req.query.limit;
            let searchText = req.query.q;
            let partyId = userInfo[0].id;
            let userName = userInfo[0].name;
            let accessToken = userInfo[0].accessToken;
            let refreshToken = userInfo[0].refreshToken;

            fetch('https://api.spotify.com/v1/search?q=' + searchText + '&type=' + searchType + '&limit=' + searchLimit, {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + accessToken
                }
            }).then(response => {
                if(response["status"] === 200){
                    let searchResult = response.json();
                    res.status(200).json(searchResult);
                    res.end();
                }

            }).catch(e=> {
                console.log("Create room failed: " + e);
                this.changePagePosition(3);
            });
        }

    } catch (err) {
        res.status(500)
            .json({ message: err.message });
        res.end();
    }
});

module.exports = router;
