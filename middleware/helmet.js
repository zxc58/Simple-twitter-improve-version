// Require
const helmet = require('helmet')

// Sets custom options
const helmetArray = []
helmetArray.push(helmet.contentSecurityPolicy())
const options = {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'same-origin' }
}
// Exports
module.exports = helmet(options)
