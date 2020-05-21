const express = require("express")
const passport = require("passport")
const router = express.Router()
const Host = require('../models/host')

router.get("/spotify", passport.authenticate("spotify", {
    scope: ["user-read-email","user-read-private"]}
))

router.get("/spotify/callback/", passport.authenticate("spotify", {session: false}),
    (req, res)=>{
        //redirect the user to the frontend.
        let body = {
            accessToken: req.user.accessToken,
            refreshToken: req.user.refreshToken,
            expireTime: req.user.expireTime
        }

        res.cookie("user", req.user.id)
        res.body = body
        res.redirect("http://localhost:3000")
    }
)

router.get("/guest", async (req,res,next)=>{
    try{
        await Host.findOne({"party.id": req.query.id}).then( async partyExists =>{
            if (partyExists){
                let partyDetails = await Host.aggregate([
                    { "$match": { "party.id": req.query.id} },
                    { "$group": {_id: null,
                        id: {"$first": "$party.id"},
                        name: {"$first": "$name"},
                        tracks: {"$push": "$party.tracks"}}
                    },
                    { "$project": {id: 1, tracks: 1 ,name: 1, _id: 0} }
                ])
                res.status(200).json(partyDetails)
            }else{
                res.status(404).json({message: "couldn't find party"})
            }
        })
    }catch(err){
        res.status(500).json({message: err.message})
        res.end();
    }
})

module.exports = router