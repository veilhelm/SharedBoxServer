const router = require("express").Router();
const DatesReservedService = require("../services/datesReserved.controller");
const { authMiddleware } = require("../utils/middlewares");

router.route("/").post(authMiddleware, DatesReservedService.createNewDate);
router.route("/").get(DatesReservedService.getDate);

module.exports = router