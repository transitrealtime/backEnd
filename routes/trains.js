
const axios = require('axios');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const apiKey = '44dcad9783b36443a4469b36096fbf94';
const apiURL = `https://cors-anywhere.herokuapp.com/http://datamine.mta.info/mta_esi.php?key=${apiKey}&feed_id=`;
const router = require("express").Router();
const trainFeeds = require("../data/trainFeeds");
const stationsJson = require('../data/stations');

const timeConverter = (UNIX_timestamp) =>{
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

const getTrainTimes = async (trainId, stationId, feedId) => {
    try {
        let { data } = await axios.request({
            method: "GET",
            //url: `${apiURL}${feedId}`,
            url: `http://datamine.mta.info/mta_esi.php?key=44dcad9783b36443a4469b36096fbf94&feed_id=16`,
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
        let desired = [];

        response.forEach(function (stop) {
            if (stop.stopTimeUpdate) {
                console.log(stop)
                stop.stopTimeUpdate.forEach(function (id) {
                    if (id.stopId.includes(stationId)) {
                        const arr = {
                            routeId: stop.trip.routeId,
                            arrival: timeConverter(parseInt(id.arrival.time)),
                            departure: timeConverter(parseInt(id.departure.time)),
                            stopId: id.stopId
                        }
                        desired.push(arr);
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

});

router.get('/:train/:station', async (req, res, next) => {
    let train = req.params.train.toUpperCase();
    let station = req.params.station.toUpperCase();
    if (train in trainFeeds && station in stationsJson) {
        try {
            let trainTimes = await getTrainTimes(train, station, trainFeeds[train]);
            res.status(200).json(trainTimes);
           // console.log(timeConverter(1565808388));
        } catch (error) {
            console.log(error)
        }


    } else {
        res.status(404).send("eror")
    }
});

module.exports = router;