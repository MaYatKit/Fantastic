require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const HostModel = require('./src/models/Host')

// Setup Express
const app = express();
const port = process.env.PORT || 1000

//Connect to mongodb
const mongoUri = process.env.MONGODB_URI
mongoose.connect(mongoUri, {useNewUrlParser: true})
const db = mongoose.connection;

// Checking the DB connection
db.once('open', function(){
    console.log("Connected to MongoDB.");
});
db.on('error', function(){
    console.log(err);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`App server listening on port ${port}!`));