const router = require("express").Router();

router.get('/', async (req, res, next) => {
    res.status(200).send("eqweqw");
});

router.get('/:id', async (req, res, next) => {

});

router.post('/', async (req, res, next) => {

});

router.delete('/:id', async (req, res, next) => {

});

module.exports = router;