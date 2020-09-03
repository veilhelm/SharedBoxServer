const  router = require("express").Router()
const tenantServices = require("../services/tenant.controller")
const middlewares =require("../utils/middlewares")

router.route("/").post(tenantServices.createNewTenant)
router.route("/login").post(tenantServices.loginTenant)
router.route("/").put(middlewares.authMiddleware, tenantServices.updateTenant)
router.route("/").get(middlewares.authMiddleware, tenantServices.getInfoTenant)

module.exports = router