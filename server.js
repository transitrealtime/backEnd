const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const db = require('mongo');



app.use(cors());
app.use(bodyParser.json());

const app = express();


module.exports = app;

app.listen(port, () => console.log(`Listening on port ${port}`));
