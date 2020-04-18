const express = require("express")
const passport = require("passport")
const router = express.Router()

router.get("/spotify", passport.authenticate("spotify", {
    scope: ["user-read-email","user-read-private"]}
))

router.get("/spotify/callback", passport.authenticate("spotify", {session: false}),
    (req, res)=>{
        res.redirect("http://localhost:3000")
    }
)

module.exports = router