const express = require('express');
const bodyParser = require('body-parser')
const user = express.Router();
const User = require('../database/models/user')
const auth = require('../middleware/auth')

user.use(bodyParser.json());

user.get('/', async(req, res, next) => {
    try{
        const users = await User.find()
        if(users) {
            res.status(200).json(users);
        } else {
            res.status(400).send("No users in database");
        }
    }
    catch(err) {
        res.status(400).send(err);
    }
})

user.get('/:id', async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(400).send("Cannot find a user with that id.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

user.post('/', async(req, res, next) => {
    try {
        const new_user = new User(req.body);
        await new_user.save();
        const token = await new_user.generateAuthToken()
        res.status(201).send({new_user, token});   
    }
    catch(err){
        res.status(400).send(err);
    }
})

user.post('/login', async(req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findByCredentials(username,password)
        if(!user) {
            res.status(401).send({error: 'Login failed, invalid credentials. Please try again.'});
        }
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})

    } catch (err) {
        res.status(400).send(err);
    }
})

// Logout current logged in user
user.post('/logout', auth, async(req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(err) {
        res.status(500).send(error);
    }
})

module.exports = user;
