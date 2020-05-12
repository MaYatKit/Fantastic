const express = require("express")
const passport = require("passport")
const router = express.Router()
const Host = require('../models/host')

router.get("/spotify", passport.authenticate("spotify", {
    scope: ["user-read-email","user-read-private"]}
))

router.get("/spotify/callback/", passport.authenticate("spotify", {session: false}),
    (req, res)=>{
        console.log("user "+ req.user.id)
        //redirect the user to the frontend.
        res.cookie("user", req.user.id)
        res.redirect("http://localhost:3000")
    }
)

module.exports = router