const router = require ('express').Router()
const spaceServices = require ('../services/space.controller')
const middlewares = require('../utils/middlewares')
const { authMiddleware } = require('../utils/middlewares')

router.route('/').post(authMiddleware,spaceServices.createSpace)
router.route('/').get(authMiddleware,spaceServices.getSpace)

module.exports = router