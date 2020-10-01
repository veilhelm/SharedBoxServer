const  router = require("express").Router()
const tenantServices = require("../services/tenant.controller")
const { authMiddleware, photosMiddleware } = require("../utils/middlewares")

router.route("/").post(tenantServices.createNewTenant)
router.route("/login").post(tenantServices.loginTenant)
router.route("/photos").post(photosMiddleware, tenantServices.savePhotos)
router.route("/").put(authMiddleware, tenantServices.updateTenant)
router.route("/").get(authMiddleware, tenantServices.getInfoTenant)
router.route("/").delete(authMiddleware, tenantServices.deleteTenant)
router.route("/reservedSpaces").put(authMiddleware, tenantServices.updateReservedSpaces)

module.exports = router