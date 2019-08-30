require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const twitter = express.Router();
const Twit = require('twit')
const Tweet = require('../database/models/tweets')

twitter.use(bodyParser.json());

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
    strictSSL: true
})

twitter.get('/', async(req, res, next) => {
    try {
        const info = await Tweet.find().sort({date:1, time:1});
        if(info) {
            res.status(200).send(info);
        } else {
            res.status(400).send("No available information regarding MTA subway available.")
        } 
    } catch(err) {
        res.status(400).send(err);
    }
})

twitter.post('/update', async(req,res,next) => {
    try{
        await T.get('statuses/user_timeline', {screen_name:'NYCTSubway', count: 20, include_rts:false, exclude_replies:true}, (err, data, response) => {
            for(let i = 0; i < data.length; i++) {
                let twitter_feed = {
                    text: data[i].text,
                    timestamp: data[i].created_at,
                    date: moment(data[i].created_at).format('MM DD, YYYY'),
                    time: moment(data[i].created_at).format('hh:mm:ss')
                }
                let twitter_feeds = new Tweet(twitter_feed);
                twitter_feeds.save();
                
            }
            res.status(200).send('Updated.')
        })
    } catch(err) {
        res.status(400).send(err); 
    }
})


module.exports = twitter;
