const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

//Setup database
const db = require('mongo');

//Importing modules from routes.
const apiRouter = require("./routes/index.js");

//Express server
const app = express();

//Prevents blocking from cors policy
app.use(cors());

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json());

//Mounts api router
app.use('/', apiRouter);


//Throws an error if path is invalid
app.get('/',(req,res,next) => {
    res.status(404).send("not a valid path. use /api/trains or /api/stations");
});


//Listens to a port
app.listen(port, () => console.log(`Listening on port ${port}`));
