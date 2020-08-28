const router = require("express").Router();
const SpaceTagService = require("../services/spaceTag.controller");
const {authMiddleware} = require("../utils/middlewares");

router.route("/").post(authMiddleware, SpaceTagService.createSpaceTag);
router.route("/").get(authMiddleware, SpaceTagService.getSpaceTag);
router.route("/").put(authMiddleware, SpaceTagService.addSpaceToTag);
router.route("/all").get(SpaceTagService.getTags)

module.exports = router;