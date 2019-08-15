const express = require('express');
const bodyParser = require('body-parser')
const twitter = express.Router();
const Twit = require('twit')
twitter.use(bodyParser.json());

const T = new Twit({
    consumer_key: 'JGRhs9VYsfzfMAwY5H9lBs0Bn',
    consumer_secret: 'OVUjd1Oh0YWRyW3OwRLpH9PT1TePldXoI5f4CQJUOKgyEbiUj6',
    access_token: '83479892-Hc8x5H0ZEIXNDHZNWtEzKtUcrDUXXHDE3f3Z4WOVR',
    access_token_secret: 's15irRpvX0j1YB9N6Ao1ZznjKlIh1t0GTDT7GmK0JFVVk',
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