// Environment Variable
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Requirements
const express = require('express')
const flash = require('connect-flash')
const passport = require('./config/passport')
const routes = require('./routes')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const path = require('path')
const { getUser } = require('./_helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const customHelmet = require('./middleware/helmet')
const sessionConfiguration = require('./config/session')
// Define Variable

// Setting Application
const app = express()
app.set('trust proxy', 1)
app.engine('.hbs', engine({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(sessionConfiguration)
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
