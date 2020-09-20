const router = require("express").Router();
const SubscriptionService = require("../services/subscription.controller");
const { authMiddleware } = require('../utils/middlewares')

router.route("/").post(authMiddleware,SubscriptionService.registerSubscription);
router.route("/").delete(authMiddleware,SubscriptionService.unRegisterSubscription);;
router.route("/sendnotification").post(authMiddleware,SubscriptionService.sendPushNotification);
router.route("/").get(authMiddleware,SubscriptionService.isUserSubscribed);

module.exports = router;