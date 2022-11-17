const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin, antiAuthenticated } = require('../../middleware/auth')

router.get('/signin', antiAuthenticated, adminController.signInPage)
router.post('/signin', antiAuthenticated, passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/logout', authenticatedAdmin, adminController.logout)

router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)

router.get('/users', authenticatedAdmin, adminController.getUsers)

router.use('/', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))

module.exports = router
