const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

/* 登入頁面 *******************************************************/
router.get('/login', (req, res) => {
  return res.render('login')
})
/* 登入後檢驗 *******************************************************/

/* 註冊頁面 *******************************************************/
router.get('/register', (req, res) => {
  return res.render('register')
})
/* 註冊內容檢驗 ****************************************************/
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
  return User.findOrCreate({
    where: { email: email },
    defaults: {
      name: name,
      email: email,
      password: password
    },
    raw: true
  })
    .then((user) => {
      if (!user[1]) {
        req.flash('error', 'email已經存在')
        console.log('email已經存在')
        return res.redirect('/Users/register')
      }
      req.flash('success', '註冊成功! 請登入!')
      console.log('註冊成功! 請登入!')
      return res.redirect('/Users/login')
    })
    .catch((error) => {
      error.errorMessage = '註冊失敗'
      next(error)
    })
})
/* 登出 *******************************************************/
router.post('/logout', (req, res) => {
  return res.send('logout')
})

module.exports = router
