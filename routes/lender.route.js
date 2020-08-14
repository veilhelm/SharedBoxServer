const router = require("express").Router()
const LenderService = require("../services/lender.controller")

router.route("/").post(LenderService.createNewLender)

module.exports = router

