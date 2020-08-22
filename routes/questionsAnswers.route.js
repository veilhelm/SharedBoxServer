const router = require("express").Router();
const questionsAnswersService = require("../services/questionsAnswers.controller");
const { authMiddleware } = require("../utils/middlewares");

router.route("/").post(questionsAnswersService.createNewQA);
router.route("/").get(questionsAnswersService.getQA);

module.exports = router