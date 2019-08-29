const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const tweetSchema = mongoose.Schema({
    timestamp: {
        type:String,
        required:true,
        unique:true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {expires: '1d'} // expires after 2 days
    }
})

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
