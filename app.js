const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const db = require('./database/db')
const app = express();
const user = require('./routes/user')

app.use(cors());
app.use('/user', user);

app.get('/', (req, res, next) => {
    console.log("Default api route");
})

if(db) {
    console.log("Database conneceted.");
    app.listen(port, () => console.log(`Listening on port ${port}`));
} else {
    console.log("Database not connected.");
}

