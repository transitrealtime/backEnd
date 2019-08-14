const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const db = require('./database/db')
const app = express();
<<<<<<< HEAD

//Prevents blocking from cors policy
app.use(cors());

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json());

//Mounts api router
app.use('/', apiRouter);
=======
const apiRouter = require("./routes/index.js");
app.use('/api', apiRouter);
>>>>>>> 7c554dec6ced22dbaf2173397e0539d3bc685f96

app.use(cors());

app.get('/', (req, res, next) => {
    res.send("Default api route, there's nothing to see here.");
})

if(db) {        // Only app.listen if MongoDB is connected
    console.log("Database connected.");
    app.listen(port, () => console.log(`Listening on port ${port}`));
} else {
    console.log("Database not connected.");
}

