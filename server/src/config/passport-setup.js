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
    }, async (accessToken, refreshToken, expires_in, profile, done)=> {
        let user = false;
        try{
            await Host.findOne({id: profile.id}).then(async (result)=>{
                if(result === null){
                    user = await new Host({
                        id: profile.id,
                        name: profile.displayName,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expireTime: Math.floor(new Date().getTime() / 1000) + expires_in,
                        party: {
                            id: Math.floor(Math.random()*100000),
                            tracks: []
                        }
                    }).save()

                }else{
                    console.log("does exist")
                    user = await Host.findOneAndUpdate({id: profile.id},
                        {accessToken: accessToken, refreshToken:refreshToken, expireTime: Math.floor(new Date().getTime() / 1000) + expires_in})
                }
            })
        }catch(e){
            console.error(e);
        }
        return done(null, user)
    })
)