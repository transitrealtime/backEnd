require('dotenv').config();
const express = require('express');
const direction = express.Router();
const decodePolyline = require('decode-google-map-polyline');
const axios = require('axios');

const getGoogleData = async(origin,destination) => {
    try {
        let { data } = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&avoid=indoors&alternatives=true&mode=transit&key=${process.env.GOOGLE_KEY}`)
        let directions = [];
        data.routes.forEach(route => {
            let stepData = [];
            let trains = "";
            route.legs[0].steps.forEach(step => {
                if (step.transit_details) {
                    stepData.push({
                        instructions: step.html_instructions,
                        duration: step.duration.text,
                        transitType: step.travel_mode,
                        trainInfo: {
                            arrivalStop: step.transit_details.arrival_stop.name, 
                            departureStop: step.transit_details.departure_stop.name,
                            stops: step.transit_details.num_stops,
                            trainColor: step.transit_details.line.color,
                            train: step.transit_details.line.short_name,
                            startLocation: { latitude: step.start_location.lat, longitude: step.start_location.lng },
                            endLocation: { latitude: step.end_location.lat, longitude: step.end_location.lng }
                        }
                    })
                    trains+=`${step.transit_details.line.short_name} `
                } else {
                    stepData.push({
                        instructions: step.html_instructions,
                        duration: step.duration.text,
                        transitType: step.travel_mode,
                        startLocation: { latitude: step.start_location.lat, longitude: step.start_location.lng },
                        endLocation: { latitude: step.end_location.lat, longitude: step.end_location.lng }
                    })
                    trains+="Walk "
                }
            })
            directions.push({
                routeStart: route.legs[0].start_address,
                routeEnd: route.legs[0].end_address,
                departure: route.legs[0].departure_time.text,
                arrival: route.legs[0].arrival_time.text,
                tripDuration: route.legs[0].duration.text,
                steps: stepData,
                path: trains.substring(0,trains.length-1).split(" "),
                polyLine: decodePolyline(route.overview_polyline.points)
            })
        })
        return directions;
    }catch (err) {
        console.log(err)
    }
}

direction.get('/:origin/:destination', async (req, res, next) =>{
    let origin = req.params.origin;
    let destination = req.params.destination;
    try{
        let data = await getGoogleData(origin,destination);
        res.status(200).send(data);
    }catch(err){
        res.statu(404).send("Bad Request")
    }
});

direction.put('/', async (req, res, next) => {
    res.status(404).send("Denied");
});

direction.post('/', async (req, res, next) => {
    res.status(404).send("Denied");
});

direction.delete('/', async (req, res, next) => {
    res.status(404).send("Denied");
});


module.exports = direction;