const express = require("express")
const passport = require("passport")
const router = express.Router()

router.get("/spotify", passport.authenticate("spotify", {
    scope: ["user-read-email","user-read-private"]}
))

router.get("/spotify/callback/", passport.authenticate("spotify", {session: false}),
    (req, res)=>{
        //redirect the user to the frontend.
        res.redirect("http://localhost:3000")
    }
)

router.get("/create", (req, res)=>{
    console.log("req: " + req.cookies["userid"]);
    //todo once get userid from bowser cookies,
    // then need to query from database if there is valid token, username and etc.
    // if there is valid token then no need to login and return a roomid and userName to the user.
    // otherwise, redirect to soptify login page, if login success, save the token and the cookies and etc
    res.cookie('userid', '123');
    res.json({status: "ok", roomId: 123, userName: "abb", songs: [{name: "From server",album: "Ice 2004",icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/d5/61/db/d561dba6-9d4f-cd9a-14ac-66ef1c267523/source/256x256bb.jpg",votes: 2}]})
    res.end('ok');
})

module.exports = router
