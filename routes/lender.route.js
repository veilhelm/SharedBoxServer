const router = require("express").Router()
const LenderService = require("../services/lender.controller")

router.route("/").post(LenderService.createNewLender)
router.route("/login").post(LenderService.loginLender)

module.exports = router

