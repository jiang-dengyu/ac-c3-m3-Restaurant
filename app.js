const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
console.log(process.env.NODE_ENV)

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const router = require('./routes')
const passport = require('./config/passport')

const messageHandler = require('./middelwares/message-handler')
const errorHandler = require('./middelwares/error-handler')

const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
