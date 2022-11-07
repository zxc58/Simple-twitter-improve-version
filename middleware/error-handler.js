//
const logger = require('../helpers/winston')
//
module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
      logger.error(`Error occurred at ${new Date().toISOString()}\n\t${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
      logger.error(`Error occurred at ${new Date().toISOString()}\n${err}`)
    }
    res.redirect('back')
  }
}
