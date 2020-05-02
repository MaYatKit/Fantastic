const express = require("express")
const router = express.Router()
const Host = require("../models/host")

router.get("/", async (req,res,next)=>{
    try{
        let partyDetails = await Host.aggregate([
            { "$match": { id: req.cookies.user} },
            { "$group": {_id: null,
                id: {"$first": "$party.id"},
                name: {"$first": "$name"},
                tracks: {"$push": "$party.tracks"}}
            },
            { "$project": {id: 1, tracks: 1 ,name: 1, _id: 0} }
        ])

        if(!partyDetails || partyDetails.length === 0){
            res.status(404).json({message: "couldn't find host"})
        }else{
            res.status(200).json(partyDetails)
            res.end();
        }

    }catch(err){
        res.status(500).json({message: err.message})
        res.end();
    }
})

router.post("/", async (req,res,next) =>{
    let track = req.body.track
    await HostModel.findOneAndUpdate(
        { id: req.cookies.user},
        { $push: {'party.tracks': track }}
        ).then(()=>{
            HostModel.findOne({id:"234"}).then((result)=>{
                assert.equal(result.party.tracks.length, 1)
            })
    })
})

module.exports = router