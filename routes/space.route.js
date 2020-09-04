const router = require ('express').Router()
const spaceServices = require ('../services/space.controller')
const { authMiddleware } = require('../utils/middlewares')

router.route('/').post(authMiddleware, spaceServices.createSpace)
router.route('/').get(authMiddleware, spaceServices.getSpaceOfLender)
router.route('/tenant').get(spaceServices.getSpaceTenant)

module.exports = router