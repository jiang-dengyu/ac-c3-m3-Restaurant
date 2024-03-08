const express = require('express')
const router = express.Router()

/* ********************************************************** */
const Stores = require('./Stores')
const Users = require('./Users')
router.use('/Stores', Stores)
router.use('/Users', Users)

/* ********************************************************** */
router.get('/', (req, res) => {
  res.redirect('/Stores')
})
/* ********************************************************** */
module.exports = router
