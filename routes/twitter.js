const express = require('express');
const bodyParser = require('body-parser')
const twitter = express.Router();

twitter.use(bodyParser.json());



module.exports = twitter;