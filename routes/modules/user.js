const express = require('express')
const router = express.Router()
const User = require('../../models/user.js')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }
))

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/register', (req, res) => {
  let { name, email, password, password2 } = req.body
  name = name.trim()
  email = email.trim()
  password = password.trim()
  password2 = password2.trim()

  // 檢查
  const errors = []
  if (!email || !password || !password2) {
    errors.push({ message: '除了姓名外，其餘欄位都是必填' })
  }
  if (password !== password2) {
    errors.push({ message: '兩次密碼不一致，請重新輸入' })
  }
  if (errors.length > 0) {
    res.render('users/register', { errors, name, email, password, password2 })
    return false
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.push({ message: '此信箱已被申請，請更換信箱' })
        return res.render('users/register', { errors, name, email, password, password2 })
      }
      const newUser = new User({
        name,
        email,
        password
      })

      bcrypt.genSalt(10, (err, salt) => {
        if (err) return console.log(err)

        bcrypt.hash(newUser.password, salt)
          .then(hash => {
            newUser.password = hash
            return newUser.save()
          })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      })
    })
})

router.get('/logout', (req, res) => {
  req.logout() // 移除 req.user 屬性，並清除 login session
  req.flash('success_msg', '您已成功登出，若欲繼續使用請重新登入')
  res.redirect('/users/login')
})

module.exports = router
