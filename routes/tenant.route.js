const  router = require("express").Router()
const tenantServices = require("../services/tenant.controller")

router.route("/").post(tenantServices.createNewTenant)

module.exports = router