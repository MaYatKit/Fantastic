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

        let fakeParty = {
            id: "12345",
            tracks:[
                {
                    name: "Dancing Queen",
                    uri: "spotify:track:0GjEhVFGZW8afUYGChu3Rr",
                    artist: "ABBA",
                    album: "Arrival",
                    votes: 1,
                    albumIcon:{
                        small: "https://i.scdn.co/image/ab67616d0000485170f7a1b35d5165c85b95a0e0",
                        large: "https://i.scdn.co/image/ab67616d0000b27370f7a1b35d5165c85b95a0e0"
                    }
                },
                {
                    name: "The Winner Takes It All",
                    uri: "spotify:track:3oEkrIfXfSh9zGnE7eBzSV",
                    artist: "ABBA",
                    album: "Super Trouper",
                    votes: 0,
                    albumIcon:{
                        small: "https://i.scdn.co/image/ab67616d000048514d08fc99eff4ed52dfce91fa",
                        large: "https://i.scdn.co/image/ab67616d0000b2734d08fc99eff4ed52dfce91fa"
                    }
                },
                {
                    name: "Don't Stop Me Now - 2011 Mix",
                    uri: "spotify:track:5T8EDUDqKcs6OSOwEsfqG7",
                    artist: "Queen",
                    album: "Jazz (2011 Remaster)",
                    votes: 2,
                    albumIcon:{
                        small: "https://i.scdn.co/image/ab67616d000048517c39dd133836c2c1c87e34d6",
                        large: "https://i.scdn.co/image/ab67616d0000b2737c39dd133836c2c1c87e34d6"
                    }
                },
                {
                    name: "We Will Rock You - Remastered",
                    uri: "spotify:track:4pbJqGIASGPr0ZpGpnWkDn",
                    artist: "Queen",
                    album: "News Of The World (2011 Remaster)",
                    votes: 5,
                    albumIcon:{
                        small: "https://i.scdn.co/image/ab67616d000048511f7077ae1018b5fbab08dfa8",
                        large: "https://i.scdn.co/image/ab67616d0000b2731f7077ae1018b5fbab08dfa8"
                    }
                },
            ]
        }
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
                        party: Object.assign( {}, fakeParty, {id: Math.floor(Math.random()*100000) } )
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
        //check if host exists in the database, if not create a new one.
    })
)
