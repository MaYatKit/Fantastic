require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')
require("./src/config/passport-setup")

// Setup Express
const app = express();
const port = process.env.PORT || 1000

//Connect to mongodb
const mongoUri = process.env.MONGODB_URI + "appData"
mongoose.connect(mongoUri, {useNewUrlParser: true})
const db = mongoose.connection;

// Checking the DB connection
db.once('open', function(){
    console.log("Connected to MongoDB.");
});

app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(express.json())
app.use(passport.initialize())

//Exporting routes
const auth = require("./src/routes/auth-route")
app.use("/auth", auth)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`App server listening on port ${port}!`));