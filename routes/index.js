const router = require("express").Router();
const stationsRouter = require("./stations");
const trainsRouter = require("./trains");
const userRouter = require('./user');
const twitterRouter = require('./twitter');
const favoriteRouter = require('./favorite');
const directionRouter = require('./direction');


router.use("/user", userRouter);
router.use("/tweets", twitterRouter);
router.use("/stations", stationsRouter);
router.use("/trains", trainsRouter);
router.use("/favorite", favoriteRouter);
router.use("/direction", directionRouter);

router.use((req, res, next) => {
    res.status(404).send("Not Found, Please Check URL!");
  });

  module.exports = router;