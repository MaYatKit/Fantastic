require('dotenv').config()
const mongoose = require('mongoose')
const HostModel = require('../src/models/Host')
const assert = require('assert')

let mongo_uri = process.env.MONGODB_URI

describe('Host model tests for mongodb', ()=>{
    before(async ()=>{
        await mongoose.connect(mongo_uri, {useNewUrlParser: true, dbName: 'test'}, (err)=>{
            if (err) {
                console.error(err);
                process.exit(1);
            }else{
                console.log("connected")
            }
        })
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

    it('create host with duplicate id and throw error', async ()=>{
        let duplicateHost = new HostModel({
            id: 'abc123',
            name:'test1'
        })

        await duplicateHost.save(function (err) {
            assert(err.name == 'ValidationError');
        });
    })

    it('find host by id', async ()=>{
        await HostModel.findOne({id:'abc123'}).then(host =>{
            assert(host.id === 'abc123')
        })
    })

    it('delete host successfully', async ()=>{
        await HostModel.deleteOne({id: 'abc123'}).then(()=>{
            HostModel.findOne({id:'abc123'}, (err, host) => {
                assert(host  === null)
            })
        })
    })

    after(async ()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
})