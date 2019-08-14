
const axios = require('axios');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const apiKey = '44dcad9783b36443a4469b36096fbf94';
const apiURL = `http://datamine.mta.info/mta_esi.php?key=${apiKey}&feed_id=`;
const router = require("express").Router();
const trainFeeds = require("../data/trainFeeds");
const stationsJson = require('../data/stations');

const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    var tmpDate = new Date(`${month} ${data} ${hour}${min}${sec} GMT ${year}`);
    return time;
}

const getTrainTimes = async (trainId, stationId, feedId) => {
    try {
        let { data } = await axios.request({
            method: "GET",
            url: `${apiURL}${feedId}`,
            //url: `http://datamine.mta.info/mta_esi.php?key=44dcad9783b36443a4469b36096fbf94&feed_id=16`,
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
        console.log(stationName);
        let desired = [];
        response.forEach(function (stop) {
            if (stop.stopTimeUpdate) {
                //console.log(stop)
                stop.stopTimeUpdate.forEach(function (id) {
                    if (id.stopId.includes(stationId)) {
                        // let utcSeconds = parseInt(id.arrival.time);
                        // let d = new Date(utcSeconds*1000); // The 0 there is the key, which sets the date to the epoch
                        // console.log(d);
                        var d = new Date(parseInt(id.arrival.time*1000));
                        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
                        var nd = new Date(utc + (3600000 * -4));
                        let minutes = (nd - new Date())/60000;
                        //nd.toLocaleString();
                        const arr = {
                            routeId: stop.trip.routeId,
                            arrival: nd.toLocaleString(),
                            departure: nd.toLocaleString(),
                            stopId: id.stopId,
                            stopName : stationName,
                            minutesUntilArrival : minutes.toFixed(0) == 0 ? "Arriving Now" : minutes.toFixed(0) == 1 ? minutes.toFixed(0) + " min" : minutes.toFixed(0) + " mins"
                        }
                        if (minutes >= 0) desired.push(arr);
                    }
                });
            }
        })
        return desired;
    } catch (err) {
        console.log(err.response);
    }
}


router.get('/', (req, res, next) => {
    res.status(200).send("go to /train/station");
});

router.get('/:train/:station', async (req, res, next) => {
    let train = req.params.train.toUpperCase();
    let station = req.params.station.toUpperCase();
    if (train in trainFeeds && station in stationsJson) {
        try {
            let trainTimes = await getTrainTimes(train, station, trainFeeds[train]);
            res.status(200).json(trainTimes);
        } catch (error) {
            console.log(error)
        }


    } else {
        res.status(404).send("eror")
    }
});

module.exports = router;