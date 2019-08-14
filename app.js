const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const db = require('./database/db')
const app = express();
const user = require('./routes/user')

app.use(cors());
app.use('/api/user', user);

app.get('/', (req, res, next) => {
    res.send("Default api route");
})

if(db) {        // Only app.listen if MongoDB is connected
    console.log("Database connected.");
    app.listen(port, () => console.log(`Listening on port ${port}`));
} else {
    console.log("Database not connected.");
}

