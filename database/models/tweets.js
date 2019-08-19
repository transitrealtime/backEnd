const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const tweetSchema = mongoose.Schema({
    timestamp: {
        type:String,
        required:true,
        unique:true
    },
    text: {
        type: String,
        required: true,
        unique:true
    }
})

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
