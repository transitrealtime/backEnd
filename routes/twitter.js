require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const twitter = express.Router();
const Twit = require('twit');
twitter.use(bodyParser.json());

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
    strictSSL: true
})

twitter.get('/', async(req,res,next) => {
    try {
        T.get('statuses/user_timeline', { screen_name: 'NYCTSubway', count: 10, include_rts: false, exclude_replies: true }, (err, data, response) => {
            res.status(200).send(data);
          })
    } catch(err) {
        res.status(400).send(err);
    }
})


module.exports = twitter;