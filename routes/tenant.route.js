const  router = require("express").Router()
const tenantServices = require("../services/tenant.controller")
const middlewares =require("../utils/middlewares")

router.route("/").post(tenantServices.createNewTenant)
router.route("/login").post(tenantServices.loginTenant)
router.route("/").put(middlewares.authMiddleware, tenantServices.updateTenant)
router.route("/").get(middlewares.authMiddleware, tenantServices.getInfoTenant)
router.route("/").delete(middlewares.authMiddleware, tenantServices.deleteTenant)

module.exports = router