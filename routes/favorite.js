const express = require('express');
const bodyParser = require('body-parser')
const favorite = express.Router();
const md5Hex = require('md5-hex');
const Device = require('../database/models/device')

favorite.use(bodyParser.json());

favorite.post('/:id/:station(*)', async(req, res, next) => {
    try {
        const salt_id = await md5Hex(req.params.id)
        const device = await Device.findSaltDevice(salt_id);
        if(device) {
            await Device.findOneAndUpdate(
                {deviceid:device.deviceid},
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

favorite.put('/:id/:station(*)', async(req, res, next) => {
    try {
        const salt_id = await md5Hex(req.params.id)
        const device = await Device.findSaltDevice(salt_id);
        if(device) {
            await Device.findOneAndUpdate(
                {deviceid:device.deviceid},
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
        const salt_id = await md5Hex(req.params.id)
        const device = await Device.findSaltDevice(salt_id);
        if(device) {
            const favorite_stations = await Device.findOne(device, 'stations');
            res.status(200).send(favorite_stations.stations)
        } else {
            res.status(400).send("Device id does not exist.");
        }
    } catch(err) {  
        res.status(400).send(err);
    }
})

module.exports = favorite;
