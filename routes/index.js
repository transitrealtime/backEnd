const router = require("express").Router();
const stationsRouter = require("./stations");
const trainsRouter = require("./trains");

router.use("/stations", stationsRouter);
router.use("/trains", trainsRouter);

router.use((req, res, next) => {
    res.status(404).send("Not Found, Please Check URL!");
  });

  module.exports = router;