const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

const passport = require('passport')

/* 登入頁面 ****************************************************** */
router.get('/login', (req, res) => {
  return res.render('login')
})
/* 登入後LocalStrategy檢驗 ****************************************************** */
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/Stores',
    failureRedirect: '/Users/login',
    failureFlash: true
  })
)
/* oauth 轉介facebook登入 ****************************************************** */
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

/* oauth 轉介facebook登入後檢驗 ****************************************************** */
router.get(
  '/oauth2/redirect/facebook',
  passport.authenticate('facebook', {
    successRedirect: '/Stores',
    failureRedirect: '/login',
    failureMessage: true
  })
)
/* 註冊頁面 ****************************************************** */
router.get('/register', (req, res) => {
  return res.render('register')
})
/* 註冊內容檢驗  *************************************************** */
router.post('/register', (req, res, next) => {
  const { email, name, password, confirmPassword } = req.body

  if (!email || !password) {
    req.flash('error', 'email passwor為必填')
    return res.redirect('back')
  }
  if (password !== confirmPassword) {
    req.flash('error', 'password與confirmPassword需要一樣')
    console.log('password與confirmPassword需要一樣')
    return res.redirect('back')
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) => {
      console.log(hash, '斷點1')
      return User.findOrCreate({
        where: { email: email },
        defaults: {
          name: name,
          email: email,
          password: hash
        },
        raw: true
      })
    })
    .then((Created) => {
      console.log(Created)
      if (!Created[1]) {
        req.flash('error', 'email已經存在')
        console.log('email已經存在')
        return res.redirect('/Users/register')
      } else {
        req.flash('success', '註冊成功! 請登入!')
        console.log('註冊成功! 請登入!')
        return res.redirect('/Users/login')
      }
    })
    .catch((error) => {
      error.errorMessage = '註冊失敗'
      next(error)
    })
})
/* 登出 *******************************************************/
router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }

    return res.redirect('/Users/login')
  })
})

module.exports = router
