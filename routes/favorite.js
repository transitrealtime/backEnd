const express = require('express');
const bodyParser = require('body-parser')
const favorite = express.Router();
const Device = require('../database/models/device')

favorite.use(bodyParser.json());

favorite.post('/:id/:station', async(req, res, next) => {
    try {
        const device_id = await Device.findOne({deviceid :req.params.id});
        if(device_id) {
            await Device.findOneAndUpdate(
                {deviceid:req.params.id},
                {$push:
                    {stations: req.params.station}
                },
            )   
            res.status(200).send("Added station.")
        } else {
            let device = {
                deviceid: req.params.id,
                stations: req.params.station
            }
            const new_device = new Device(device);
            await new_device.save();
            res.status(201).send(new_device);
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

favorite.put('/:id/remove', async(req, res, next) => {
    try {
        const device_id = await Device.findOne({deviceid:req.params.id});
        if(device_id) {
            await Device.findOneAndUpdate(
                {deviceid:req.params.id},
                {$pull:
                    {stations: req.params.station}
                },
            )   
            res.status(200).send("Removed a station.")
        } else {
            res.status(400).send("Device id does not exist.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

favorite.get('/:id/stations', async(req, res, next) => {
    try {
        const device = await Device.findOne({deviceid:req.params.id});
        if(device) {
            const favorite_stations = await Device.findOne({deviceid:req.params.id}, 'stations');
            res.status(200).send(favorite_stations.stations)
        } else {
            res.status(400).send("Device id does not exist.");
        }
    } catch(err) {
        res.status(400).send(err);
    }
})

module.exports = favorite;