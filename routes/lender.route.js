const router = require("express").Router()
const LenderService = require("../services/lender.controller")
const { authMiddleware } = require("../utils/middlewares")

router.route("/").post(LenderService.createNewLender)
router.route("/login").post(LenderService.loginLender)
router.route("/").get( authMiddleware, LenderService.getLender)

module.exports = router

