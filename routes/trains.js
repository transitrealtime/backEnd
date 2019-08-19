require('dotenv').config();
const axios = require('axios');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const apiURL = `http://datamine.mta.info/mta_esi.php?key=${process.env.API_KEY}&feed_id=`;
const router = require("express").Router();
const trainFeeds = require("../data/trainFeeds");
const stationsJson = require('../data/stations');
const stationTrains = require("../data/trainStops")
const feeds = require('../data/feeds')

const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    let amOrPm = " AM";
    if (hour > 12) {
        hour -= 12;
        amOrPm = " PM"
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    var time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec + amOrPm;
    return time;
}

const getTrainTimes = async (trainId, stationId, feedId) => {
    try {
        let { data } = await axios.request({
            method: "GET",
            url: `${apiURL}${feedId}`,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "content-type": 'application/json'
            },
            responseType: 'arraybuffer',
            responseEncoding: 'utf8'
        })
        const typedArray = new Uint8Array(data);
        const body = [...typedArray];
        let response = [];
        let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        feed.entity.forEach(function (entity) {
            if (entity.tripUpdate && entity.tripUpdate.trip.routeId === trainId) {
                response.push(entity.tripUpdate);
            }
        });
        let stationName = stationsJson[stationId]['Stop Name'];
        let desiredNorth = [];
        let desiredSouth = [];
        response.forEach(function (stop) {
            if (stop.stopTimeUpdate) {
                stop.stopTimeUpdate.forEach(function (id) {
                    if (id.stopId.includes(stationId)) {
                        let posixTime = parseInt(id.arrival.time - 14400);
                        let currentTime = Date.now();
                        let arrivalTime = (id.arrival.time * 1000 - currentTime) / 60000;
                        posixTime = timeConverter(posixTime);
                        let postfix = arrivalTime.toFixed(0) > 1 ? " Mins" : " Min";
                        const arr = {
                            routeId: stop.trip.routeId,
                            arrival: posixTime,
                            stopId: id.stopId,
                            stopName: stationName,
                            posixTime: parseInt(id.arrival.time - 14400),
                            minutesArrival: arrivalTime.toFixed(0) != 0 ? arrivalTime.toFixed(0) + postfix : "Arriving Now"
                        }
                        if (arrivalTime.toFixed(0) > 0) id.stopId[id.stopId.length - 1] == "N" ? desiredNorth.push(arr) : desiredSouth.push(arr);
                    }
                });
            }
        })
        return { "northBound": desiredNorth.sort((a, b) => { return a.posixTime - b.posixTime }), "southBound": desiredSouth.sort((a, b) => { return a.posixTime - b.posixTime }) };
    } catch (err) {
        console.log(err.response);
    }
}

const filterTrain = id => {
    filteredTrain = [];
    let trainStops = stationTrains[id];
    //console.log(trainStops);
    for (let station of Object.values(trainStops)) {
        //let found = false;
        for (let stationId of Object.keys(stationsJson)) {
            if (station === stationsJson[stationId]["Stop Name"]) {
                //found = true;
                let dayTimeRoutes = stationsJson[stationId]["Daytime Routes"];
                if (dayTimeRoutes == id || (typeof dayTimeRoutes != "number" && dayTimeRoutes.split(" ").includes(id))) {
                    filteredTrain.push({ "stationName": station, "stationId": stationId, "trainRoutes": dayTimeRoutes });
                    break;
                }
            }
        }
        //if (!found) console.log(station);
    }
    return filteredTrain;
}

const getAllNow = async (feedId) => {
    console.log(feedId)
    try {
        let { data } = await axios.request({
            method: "GET",
            url: `${apiURL}${feedId}`,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "content-type": 'application/json'
            },
            responseType: 'arraybuffer',
            responseEncoding: 'utf8'
        })
        const typedArray = new Uint8Array(data);
        const body = [...typedArray];
        let response = [];
        let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        feed.entity.forEach(function (entity) {
            if (entity.tripUpdate) {
                response.push(entity.tripUpdate)
            }
        });
        let desired = [];
        response.forEach(function (stop) {
            console.log(stop)
            if (stop.stopTimeUpdate) {
                stop.stopTimeUpdate.forEach(function (id) {
                    if (id.arrival != null) {
                        let currentTime = Date.now();
                        let arrivalTime = (id.arrival.time * 1000 - currentTime) / 60000;
                        if (arrivalTime.toFixed(0) <= 0) {
                            for (let stationId of Object.keys(stationsJson)) {
                                if(stationId === id.stopId.substring(0,id.stopId.length-1)){
                                    console.log(stationsJson[stationId]["GTFS Longitude"])
                                    const arr = {
                                        stationId: id.stopId.substring(0, id.stopId.length - 1),
                                        stopName: stationsJson[stationId][`Stop Name`],
                                        bound: id.stopId.substring(id.stopId.length - 1),
                                        latitude: stationsJson[stationId]["GTFS Latitude"],
                                        Longitude: stationsJson[stationId]["GTFS Longitude"],
                                        train: stop.trip.routeId
                                    }
                                    desired.push(arr);
                                }
                            }
                        }
                    }

                });
            }
        })
        return desired
    } catch (err) {
        console.log(err);
    }
}

router.get('/now', async (req, res, next) => {
    const id = []
    for (let feedId of Object.values(feeds)) {
        id.push(feedId);
    }
    let response = [];
    for (let i = 0; i < id.length; i++) {
        response.push(await getAllNow(id[i]))
    }
    res.status(200).json(response);
})

router.get('/', (req, res, next) => {
    res.status(200).send("go to /train/station");
});

router.get('/:train', (req, res, next) => {
    let trainId = req.params.train.toUpperCase();
    if (trainId in trainFeeds) {
        res.status(200).json(filterTrain(trainId));
    }
});

router.get('/:train/:station', async (req, res, next) => {
    let train = req.params.train.toUpperCase();
    let station = req.params.station.toUpperCase();
    if (train in trainFeeds && station in stationsJson) {
        try {
            let trainTimes = await getTrainTimes(train, station, trainFeeds[train]);
            if (trainTimes) res.status(200).json(trainTimes);
            else {
                res.status(404).send("MTA API DOWN. Try again in a few minutes.");
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(404).send("eror")
    }
});

module.exports = router;