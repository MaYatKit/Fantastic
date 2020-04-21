require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')
require("./src/config/passport-setup")
var cookieParser = require('cookie-parser')

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
// app.use(cors({
//     origin:["http://localhost:3000"],
//     methods:['GET','POST', 'PUT'],
//     alloweHeaders:['Content-Type', 'Authorization','Accept'],
//     allowCredentials:true
// }))
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
app.use(allowCrossDomain);

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

//Exporting routes
const auth = require("./src/routes/auth-route")
app.use("/auth", auth)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`App server listening on port ${port}!`));
