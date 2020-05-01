const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

var trackSchema = new mongoose.Schema({
    uri:{
        type: String,
        required: true
    },
    name: String,
    artist: String,
    album: String,
    votes: {
        type: Number,
        default: 0
    },
    albumIcon:{
        small: String,
        large: String
    }
})

var partySchema = new mongoose.Schema({
    name: String,
    id: {
        type: String,
        required: true,
        unique: true
    },
    currentTrack: trackSchema,
    tracks: [trackSchema]
})

var hostSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    name: String,
    accessToken: String,
    refreshToken: String,
    expireTime: String,
    party: partySchema
})

hostSchema.plugin(uniqueValidator)

module.exports = mongoose.model('host', hostSchema)
