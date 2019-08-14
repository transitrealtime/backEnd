const express = require('express');
const bodyParser = require('body-parser')
const user = express.Router();
const User = require('../database/models/user')

user.use(bodyParser.json());

user.get('/', (req, res, next) => {
    User.find()
    .then(docs => {
        if(docs) {
            res.status(200).json(docs);
        } else {
            res.status(400).send("No users in database");
        }
    })
    .catch(err => {
        console.log(err);
    })
})


module.exports = user;
