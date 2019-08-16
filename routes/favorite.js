const express = require('express');
const bodyParser = require('body-parser')
const favorite = express.Router();
const User = require('../database/models/user')

favorite.use(bodyParser.json());

favorite.put('/:id/train/:train', async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            await User.findByIdAndUpdate(
                req.params.id,
                {$push:
                    {trains: req.params.train}
                },
            )   
            res.status(200).send("Added train.")
        } else {
            res.status(400).send("User does not exist.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

favorite.put('/:id/train/:train/remove', async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            await User.findByIdAndUpdate(
                req.params.id,
                {$pull:
                    {trains: req.params.train}
                },
            )   
            res.status(200).send("Removed a train.")
        } else {
            res.status(400).send("User does not exist.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

favorite.put('/:id/station/:station', async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            await User.findByIdAndUpdate(
                req.params.id,
                {$push:
                    {stations: req.params.station}
                },
            )   
            res.status(200).send("Added station.")
        } else {
            res.status(400).send("User does not exist.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

favorite.put('/:id/station/:station/remove', async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            await User.findByIdAndUpdate(
                req.params.id,
                {$pull:
                    {stations: req.params.station}
                },
            )   
            res.status(200).send("Removed a station.")
        } else {
            res.status(400).send("User does not exist.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})


favorite.get('/:id/trains', async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            const favorite_trains = await User.findById(req.params.id, 'trains');
            res.status(200).send(favorite_trains.trains)
        } else {
            res.status(400).send("User does not exist.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

favorite.get('/:id/stations', async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            const favorite_trains = await User.findById(req.params.id, 'stations');
            res.status(200).send(favorite_trains.stations)
        } else {
            res.status(400).send("User does not exist.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

module.exports = favorite;