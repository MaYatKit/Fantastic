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
        clientID: "38c1268007c94332bec6779dadad7837",
        clientSecret: "5d4a897bbd944514b820d621302b337b",
        callbackURL: "http://localhost:1000/auth/spotify/callback/"
    }, (accessToken, refreshToken, expires_in, profile, done)=> {
        console.log("accessToken " + accessToken)
        console.log("expires_in " + expires_in)
        console.log("ID: " + profile.id)
        console.log("displayName: " + profile.displayName)
        return done(null, profile)
        //check if host exists in the database, if not create a new one.
    })
)