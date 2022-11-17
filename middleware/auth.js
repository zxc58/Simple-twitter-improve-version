const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    } else {
      return next()
    }
  }
  if (req.path !== '/') { req.flash('error_messages', 'Please sign in first') }
  return res.redirect('/signin')
}
const antiAuthenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return res.redirect('/')
  }
  return next()
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  antiAuthenticated
}
