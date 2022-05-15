const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const user = require('./modules/user')
const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/auth')
const admin = require('./modules/admin')


router.use('/users', authenticated, user)
router.use('/admin', admin)
router.use('/tweets', authenticated, tweet)
router.use('/followships', followship)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)
router.get('/users/setting/:id', authenticated, userController.getSetting)
router.put('/users/setting/:id', authenticated, userController.putSetting)


router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)
module.exports = router