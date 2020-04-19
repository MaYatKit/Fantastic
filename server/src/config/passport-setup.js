require('dotenv').config()
const passport = require("passport")
const SpotifyStrategy = require("passport-spotify").Strategy
const Host = require("../models/host")

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
done(null, user);
});

passport.use(
    new SpotifyStrategy({
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: process.env.SPOTIFY_CALLBACK_URL
    }, (accessToken, refreshToken, expires_in, profile, done)=> {
        console.log("accessToken " + accessToken)
        console.log("expires_in " + expires_in)
        console.log("ID: " + profile.id)
        console.log("displayName: " + profile.displayName)

        let host

        Host.findOne({id: profile.id}).then((result)=>{
            if(result === null){
                host = new Host({
                    id: profile.id,
                    name: profile.displayName,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }).save()
            }else{
                result.accessToken = accessToken
                result.refreshToken = refreshToken
                result.save()
                host = result
            }
        })
        return done(null, profile)
        //check if host exists in the database, if not create a new one.
    })
)