const express = require('express')

// Setup Express
const app = express();
const port = process.env.PORT || 1000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => console.log(`App server listening on port ${port}!`));