import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose, { get } from 'mongoose'
import express from 'express'
import partyRoutes from '../src/routes/party'
import fetch from 'isomorphic-unfetch'
import host from '../src/models/host'
import cookieParser from 'cookie-parser'

let server, mongo

describe('Test for adding and editing playlists users in mongodb', ()=>{
    beforeAll(async done =>{
        mongo = new MongoMemoryServer();
        let connectionString = await mongo.getConnectionString()
        await mongoose.connect(connectionString, {useNewUrlParser: true})

        let app = express()
        app.use(express.json())
        app.use("/party", partyRoutes)
        server = app.listen(8080, ()=> done())
    })

    afterAll(async done =>{
        server.close(async () => {
            await mongoose.disconnect();
            await mongo.stop();
            done()
        });
    })

    beforeEach(async ()=>{

        let tracks = [{
            uri: "testUri",
            name: "testTrackName",
            votes: 5,
            images:{
                small: "testImageLink",
                large: "testImageLink2"
            }
        }]

        let party = {
            id: "abc",
            name: "testPlaylist",
            tracks: tracks,
        }

        await new host({
            id:"234",
            name: "testHost",
            party: party
        }).save()
    })

    afterEach(async ()=>{
        await mongoose.connection.db.dropCollection("hosts")
    })

    it("GET /party/id: successfully get party details with party ID", async ()=>{
        let response = await fetch("http://localhost:8080/party/abc")
        let partyDetails = await response.json()

        expect(partyDetails).toBeTruthy()
        expect(partyDetails.name).toBe("testHost")
        expect(partyDetails.room_id).toBe("abc")
        expect(partyDetails.tracks.length).toBe(1)
    })

    it("GET /party/id: send incorrect ID and get 404", async ()=>{
        let response = await fetch("http://localhost:8080/party",{
            method: GET,

        })
        expect(response.status).toBe(404)
    })

    it("POST /party: successfully update party for given party ID", async ()=>{
        let updatedTracks = [{
            uri: "testUri",
            name: "testTrackName",
            votes: 5,
            images:{
                small: "testImageLink",
                large: "testImageLink2"
            }
        },
        {
            uri: "secondUri",
            name: "secondTrackName",
            votes: 0,
            images:{
                small: "secondImage",
                large: "secondImage2"
            }
        }]

        let data = {
            id: "abc",
            tracks: updatedTracks
        };

        let response = await fetch("http://localhost:8080/party/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })

        expect(response.status).toEqual(200)

        let updatedResponse = await fetch("http://localhost:8080/party/abc")
        let updatedPartyDetails = await updatedResponse.json()
        expect(updatedPartyDetails.tracks.length).toBe(2)

    })

    it("POST /party: send incorrect party ID and get 500", async ()=>{

        let updatedTracks = [{
            uri: "testUri",
            name: "testTrackName",
            votes: 5,
            images:{
                small: "testImageLink",
                large: "testImageLink2"
            }
        },
        {
            uri: "secondUri",
            name: "secondTrackName",
            votes: 0,
            images:{
                small: "secondImage",
                large: "secondImage2"
            }
        }]

        let data = {
            id: "123",
            tracks: updatedTracks
        };

        let response = await fetch("http://localhost:8080/party", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
        
        expect(response.status).toEqual(404)
    })
})