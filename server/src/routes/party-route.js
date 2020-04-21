const express = require("express")
const router = express.Router()
const Host = require("../models/host")

router.get("/", async (req,res,next)=>{
    try{ 
        let partyDetails = await Host.aggregate([
            //haven't tested reading user from cookie
            { "$match": { id: req.cookies.user} },
            { "$group": {_id: null, 
                id: {"$first": "$party.id"},
                tracks: {"$push": "$party.tracks"}}
            },
            { "$project": {id: 1, tracks: 1 , _id: 0} }
        ])

        if(!partyDetails || partyDetails.length === 0){
            res.status(404).json({message: "couldn't find host"})
        }

         res.status(200).json(partyDetails)

    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router