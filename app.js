const express = require('express')
const app = express()
const port = 3000

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const router = require('./routes')
const passport = require('passport')

const flash = require('connect-flash')
const session = require('express-session')

const messageHandler = require('./middelwares/message-handler')
const errorHandler = require('./middelwares/error-handler')

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: 'ThisIsStoresList',
    resave: false,
    saveUninitialized: false
  })
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler)
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
