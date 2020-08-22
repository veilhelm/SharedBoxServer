const router = require("express").Router();
const SpaceTagService = require("../services/spaceTag.controller");

router.route("/").post(SpaceTagService.createSpaceTag);
router.route("/").get(SpaceTagService.getSpaceTag);

module.exports = router;