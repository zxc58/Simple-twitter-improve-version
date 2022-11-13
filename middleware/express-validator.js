const { body, validationResult } = require('express-validator')
const validate = {
  user: [
    body('email').isEmail(),
    body('name').isLength({ min: 1, max: 50 }),
    body('account').isLength({ min: 1 }),
    body('password').isLength({ min: 1 }),
    body('checkPassword').isLength({ min: 1 }),
    (req, res, next) => {
      const errors = validationResult(req)
      const passwordsCheck = req.body.password === req.body.checkPassword
      if (errors.isEmpty() && passwordsCheck) { return next() }
      res.status(400).json({ errors: errors.array(), passwordsCheck })
    }
  ],
  signin: [
    body('account').isLength({ min: 1 }),
    body('password').isLength({ min: 1 }),
    (req, res, next) => {
      const errors = validationResult(req)
      if (errors.isEmpty()) { return next() }
      res.status(400).json({ errors: errors.array() })
    }
  ],
  reply: [
    body('comment').isLength({ min: 1, max: 140 }),
    (req, res, next) => {
      const errors = validationResult(req)
      if (errors.isEmpty()) { return next() }
      res.status(400).json({ errors: errors.array() })
    }
  ],
  tweet: [
    body('description').isLength({ min: 1, max: 140 }),
    (req, res, next) => {
      const errors = validationResult(req)
      if (errors.isEmpty()) { return next() }
      res.status(400).json({ errors: errors.array() })
    }
  ]
}

module.exports = { validate }
