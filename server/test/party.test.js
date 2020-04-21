require('dotenv').config()
const mongoose = require('mongoose')
const HostModel = require('../src/models/Host')
const assert = require('assert')

const mongo_uri = process.env.MONGODB_URI

describe('Test for adding and editing playlists users in mongodb', ()=>{
    before(async ()=>{
        await mongoose.connect(mongo_uri, {useNewUrlParser: true, dbName: 'test', useFindAndModify: false}, 
        async (err)=>{
            if (err) {
                console.error(err);
                process.exit(1);
            }
            await new HostModel({
                id:"234"
            }).save()
        })
    })

    it('create party successfully', async ()=>{
        let party = {
            id: "abc",
            name: "testPlaylist",
            tracks:[],
        }

        updatedParty = await HostModel.findOneAndUpdate(
            { id: "234" },
            {party: party}
        ).then(() =>{
            HostModel.findOne({id: "234"}).then((result)=>{
                assert.equal(result.party.id, party.id)
            })
        })
    })

    it('add track to party successfully', async()=>{
        let track = {
            uri: "testUri",
            votes: 0,
            images:{
                small: "testImageLink",
                large: "testImageLink2"
            }
        }

        await HostModel.findOneAndUpdate(
            { id: "234"},
            { $push: {'party.tracks': track }}
            ).then(()=>{
                HostModel.findOne({id:"234"}).then((result)=>{
                    assert.equal(result.party.tracks.length, 1)
                })
        })
    })

    it('get tracks from party given user id and party id successfully', async()=>{
        await HostModel.aggregate([
            { "$match": { id: "234"} },
            { "$unwind": "$party.tracks"},
            { "$group": {_id: null ,tracks: {"$push": "$party.tracks"}}},
            { "$project": {tracks: 1 , _id: 0} }
        ]).then((result)=>{
            assert(result.length === 1)
        })
    })

    it('delete track from party successfully given uri', async()=>{
        await HostModel.findOneAndUpdate(
            {id: "234"},
            {"$pull": {"party.tracks": {uri: "testUri" }}}
        ).then(()=>{
            HostModel.findOne(
                {id:"234"}
            ).then(result=>{
                assert.equal(result.party.tracks.length,0)
            })
        })
    })

    it('delete party successfully', async()=>{
        await HostModel.findOneAndUpdate(
            { id: "234" },
            { $unset: {party:1} }
        ).then(()=>{
            HostModel.findOne(
                {id:"234"}
            ).then(result=>{
                assert.equal(result.party,null)
            })
        })
    })

    after(async ()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
})