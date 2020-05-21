require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('./src/routes/ws')
require('./src/routes/real_web_socket');
require("./src/config/passport-setup")

// Setup Express
const app = express();
const port = process.env.PORT || 1000

//Connect to mongodb
const mongoUri = process.env.MONGODB_URI
mongoose.connect(mongoUri, {useNewUrlParser: true , dbName: 'appdata'})
const db = mongoose.connection;

// Checking the DB connection
db.once('open', function(){
    console.log("Connected to MongoDB.");
});

app.use(express.urlencoded({extended: true}))
// app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use(cookieParser())

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
app.use(allowCrossDomain);

//Exporting routes
const auth = require("./src/routes/auth-route")
app.use("/auth", auth)
const party = require("./src/routes/party-route")
app.use("/party", party)

const search = require("./src/routes/search")
app.use("/search", search)

const refreshToken = require("./src/routes/refreshToken")
app.use("/refresh", refreshToken.router)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`App server listening on port ${port}!`));
