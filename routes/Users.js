const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
/* LocalStrategy的策略流程***************************************** */
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    return User.findOne({
      attributes: ['id', 'name', 'email', 'password'],
      where: { email: username },
      raw: true
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'email或密碼錯誤' })
        }
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: 'email或密碼錯誤' })
          }
          return done(null, user)
        })
      })
      .catch((error) => {
        error.message = '登入失敗'
        done(null, error)
      })
  })
)
/* FacebookStrategy的策略流程***************************************** */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env['FACEBOOK_APP_ID'],
      clientSecret: process.env['FACEBOOK_APP_SECRET'],
      callbackURL: process.env['FACEBOOK_CALLBACK_URL'],
      profileFields: ['email', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      const email = profile.emails[0].value
      const name = profile.displayName

      return User.findOne({
        attributes: ['id', 'name', 'email'],
        where: { email: email },
        raw: true
      })
        .then((user) => {
          if (user) return done(null, user)

          const randomPwd = Math.random().toString(36).slice(-8)

          return bcrypt
            .hash(randomPwd, 10)
            .then((hash) => User.create({ name, email, password: hash }))
            .then((user) => done(null, { id: user.id, name: user.name, email: user.email }))
        })
        .catch((error) => {
          error.errorMessage = '登入失敗'
          done(error)
        })
    }
  )
)
/* 成功後將登入資訊存入session***************************************** */
passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})
passport.deserializeUser((user, done) => {
  done(null, { id: user.id })
})
/* 登入頁面 ****************************************************** */
router.get('/login', (req, res) => {
  return res.render('login')
})
/* 登入後local檢驗 ****************************************************** */
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/Stores',
    failureRedirect: '/Users/login',
    failureFlash: true
  })
)
/* 轉介oauth facebook登入 ****************************************************** */
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

/* 轉介oauth facebook登入後檢驗 ****************************************************** */
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
/* 註冊內容檢驗 *************************************************** */
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
