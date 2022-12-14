const express = require('express')
const router = express.Router()
const followController = require('../../controllers/follow-controller')

router.post('/', followController.postFollowship)
router.delete('/:id', followController.deleteFollowship)

module.exports = router
