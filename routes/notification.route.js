const router = require('express').Router()
const notificationServices = require ('../services/notifications.controller')
const { authMiddleware } = require('../utils/middlewares')

router.route('/').post(authMiddleware, notificationServices.createNotification)
router.route('/').get(authMiddleware, notificationServices.getNotification)
router.route('/').put(authMiddleware, notificationServices.updateNotification)

module.exports = router