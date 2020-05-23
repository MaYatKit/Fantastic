require('dotenv').config()
const mongoose = require('mongoose')
const HostModel = require('../src/models/Host')
const assert = require('assert')

const mongo_uri = process.env.MONGODB_URI

describe('Test for adding and editing playlists users in mongodb', ()=>{
    beforeAll(async ()=>{
        await mongoose.connect(mongo_uri, {useNewUrlParser: true, dbName: 'test', useFindAndModify: false}, 
        async (err)=>{
            if (err) {
                console.error(err);
                process.exit(1);
            }
        })
    })

    beforeEach(async () =>{

        let tracks = [{
            uri: "testUri",
            votes: 0,
            images:{
                small: "testImageLink",
                large: "testImageLink2"
            }
        }]

        let party = {
            id: "abc",
            name: "testPlaylist",
            tracks: tracks
        }

        await new HostModel({
            id:"234",
            party: party
        }).save()
    })

    afterEach(async () =>{
        await  mongoose.connection.db.dropCollection('hosts')
    })

    it('initialise new host successfully', async ()=>{
        let playlist = {
            id: "12345",
            name: "testPlaylist",
            tracks:[]
        }

        let validHost = new HostModel({
            id: 'abc123',
            name:'test1',
            playlists: [playlist]
        })

        let savedHost = await validHost.save()
        assert.equal(savedHost.id, validHost.id)
    })

    it('find host by id', async ()=>{
        await HostModel.findOne({id:'234'}).then(host =>{
            assert(host.id === '234')
        })
    })

    it('create host with duplicate id and throw error', async ()=>{
        let duplicateHost = new HostModel({
            id: '234',
        })

        await duplicateHost.save(function (err) {
            assert(err.name == 'ValidationError');
        });
    })

    it('delete host successfully', async ()=>{
        await HostModel.deleteOne({id: '234'}).then(async ()=>{
            await HostModel.findOne({id:'234'}, (err, host) => {
                assert(host  === null)
            })
        })
    })

    it('add track to party successfully', async()=>{
        let track = {
            uri: "testTrackUri",
            votes: 3,
            images:{
                small: "testImageLink",
                large: "testImageLink2"
            }
        }

        await HostModel.findOneAndUpdate(
            { id: "234"},
            { $push: {'party.tracks': track }}
            ).then(async ()=>{
                await HostModel.findOne({id:"234"}).then((result)=>{
                    assert.equal(result.party.tracks.length, 2)
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
        ).then( async ()=>{
            await HostModel.findOne(
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
        ).then(async ()=>{
            await HostModel.findOne(
                {id:"234"}
            ).then(result=>{
                assert.equal(result.party,null)
            })
        })
    })

    afterAll(async ()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
})