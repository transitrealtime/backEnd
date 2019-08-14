const router = require("express").Router();
const stationsRouter = require("./stations");
const trainsRouter = require("./trains");

router.use("/stations", stationsRouter);
router.use("/trains", trainsRouter);

router.use((req, res, next) => {
    const error = new Error("Not Found, Please Check URL!");
    error.status = 404;
    next(error);
  });

  module.exports = router;