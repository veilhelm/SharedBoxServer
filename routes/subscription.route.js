const router = require("express").Router();
const SubscriptionService = require("../services/subscription.controller");
const { authMiddleware } = require('../utils/middlewares')

router.route("/").post(authMiddleware,SubscriptionService.registerSubscription);
router.route("/").delete(authMiddleware,SubscriptionService.unregisterSubscription);;
router.route("/").get(authMiddleware,SubscriptionService.sendPushNotification);

module.exports = router;