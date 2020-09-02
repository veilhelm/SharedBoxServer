const router = require ('express').Router()
const scoreServices = require ('../services/score.controller')
const { authMiddleware } = require('../utils/middlewares')

router.route('/').post(authMiddleware, scoreServices.createNewScore)
/*router.route('/').get(authMiddleware, scoreServices.getSpaceOfLender)
router.route('/tenant').get(authMiddleware, scoreServices.getSpaceTenant)*/

module.exports = router