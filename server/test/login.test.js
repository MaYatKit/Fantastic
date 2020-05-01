const server = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
describe('Login oauth flow test', ()=>{
    it('call oauth endpoint', ()=>{
        chai.request(server)
            .get(`/auth/spotify`)
            .end((err,res)=>{
                console.log("res "+ res.body)
                console.log("error " + err)
            })
        })
})