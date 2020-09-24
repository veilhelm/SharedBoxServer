const router = require("express").Router();
const elementServices =require("../services/element.controller")
const {authMiddleware} = require("../utils/middlewares");

router.route("/").post(authMiddleware, elementServices.createNewElement);
router.route("/").get(authMiddleware, elementServices.getElementsTenant);
router.route("/").put(authMiddleware, elementServices.updateElements);

module.exports = router