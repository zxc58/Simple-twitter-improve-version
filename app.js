// Environment Variable
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Requirements
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const { getUser } = require('./_helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const customHelmet = require('./middleware/helmet')

// Define Variable
const sessionSecret = process.env.SESSION_SECRET

// Setting Application
const app = express()
app.engine('.hbs', engine({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }))
app.use(customHelmet)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.logInUser = getUser(req)
  next()
})
app.use(routes)

// Exports
module.exports = app
