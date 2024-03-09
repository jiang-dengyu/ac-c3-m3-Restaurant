const express = require('express')
const router = express.Router()

const authhandler = require('../middelwares/auth-handler.js')
/* ********************************************************** */
const Stores = require('./Stores')
const Users = require('./Users')
router.use('/Stores', authhandler, Stores)
router.use('/Users', Users)

/* ********************************************************** */
router.get('/', (req, res) => {
  res.redirect('/Stores')
})
/* ********************************************************** */
module.exports = router
