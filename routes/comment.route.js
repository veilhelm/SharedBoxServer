const router = require ('express').Router()
const commentServices = require ('../services/comment.controller')
const { authMiddleware } = require('../utils/middlewares')

router.route('/').post(authMiddleware, commentServices.createNewComment)
/*router.route('/').get(authMiddleware, scoreServices.getSpaceOfLender)
router.route('/tenant').get(authMiddleware, scoreServices.getSpaceTenant)*/

module.exports = router