const apiKey = '44dcad9783b36443a4469b36096fbf94';
const apiURL = `https://cors-anywhere.herokuapp.com/http://datamine.mta.info/mta_esi.php?key=${apiKey}&feed_id=`;
const router = require("express").Router();
const stationsJson = require('../data/stations');


router.get('/', (req, res, next) => {
    res.status(200).json(stationsJson);
});

router.get('/:id', (req, res, next) => {
    let id = req.params.id.toUpperCase();
    if (id in stationsJson){
        let stationData = stationsJson[id];
        res.status(200).json(stationData);
    } else{
        res.status(404).send("Station not found");
    }
});

router.put('/', async (req, res, next) => {
    res.status(404).send("Denied");
});

router.post('/', async (req, res, next) => {
    res.status(404).send("Denied");
});

router.delete('/', async (req, res, next) => {
    res.status(404).send("Denied");
});

module.exports = router;