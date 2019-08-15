require('dotenv').config()
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const db = require('./database/db')
const app = express();
const apiRouter = require('./routes');
const bodyParser = require('body-parser');

//Prevents blocking from cors policy
app.use(cors());

app.use(bodyParser.json());

//Mounts api router
app.use('/', apiRouter);

app.get('/', (req, res, next) => {
    res.send("Default api route, there's nothing to see here.");
})

if(db) {        // Only app.listen if MongoDB is connected
    console.log("Database connected.");
    app.listen(port, () => console.log(`Listening on port ${port}`));
} else {
    console.log("Database not connected.");
}

//sapp.listen(port, () => console.log(`Listening on port ${port}`));
