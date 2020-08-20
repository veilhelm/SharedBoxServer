const router = require("express").Router();
const DatesService = require("../services/dates.controller");
const { authMiddleware } = require("../utils/middlewares");

router.route("/").post(DatesService.createNewDate);

module.exports = router