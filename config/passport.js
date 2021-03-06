const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user.js')

module.exports = (app) => {
  // 1. initialize
  app.use(passport.initialize())
  app.use(passport.session())

  // 2.1 set local strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) return done(null, false, { message: '此電子郵件沒有註冊過，禁止登入' })
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) return done(null, false, { message: '信箱密碼錯誤，請重新登入' })
              return done(null, user)
            })
            .catch(err => done(err, false))
        })
        .catch(err => done(err, false))
    })
  )

  // 2.2 set FB strategy
  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile._json.email })
        .then((user) => {
          if (user) return done(null, user)

          const randomPassword = Math.random().toString(36).slice(-8)

          bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({
              name: profile._json.name,
              email: profile._json.email,
              password: hash
            }))
            .then(user => done(null, user))
            .catch(err => done(err, user))
        })
        .catch((err) => console.log(err))
    })
  )

  // 2.3 set serialize and deserialize
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .lean()
      .exec((err, user) => {
        done(err, user)
      })
  })
}
