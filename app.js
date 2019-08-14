const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const db = require('./database/db')
const app = express();
const apiRouter = require("./routes/index.js");
app.use('/api', apiRouter);

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

