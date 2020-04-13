// Set params
const port = 3000

// Load module and file
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const session = require('express-session')
const passport = require('passport')

const flash = require('connect-flash')

// DB
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

// Set express module
const app = express()
// 判別開發環境: 如果不是 production，就透過 dotenv 讀取 .env file
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Set express handlebars module
app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // define engine and its layout
app.set('view engine', 'handlebars') // set engine
app.use(bodyParser.urlencoded({ extended: true })) // Use body-parser to parse POST data
app.use(express.static('public')) // Where to find static file directory
app.use(methodOverride('_method')) // Use method-override to make RESTful routes

app.use(session({
  secret: 'Jessie oepwqnfqughqp34ug',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport.js')(passport)
app.use(flash())

// Set variable that view can use
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error')
  next()
})

// Use Router to deal with routes
app.use('/', require('./routes/home.js'))
app.use('/restaurants', require('./routes/restaurant.js'))
app.use('/users', require('./routes/user.js'))
app.use('/auth', require('./routes/auths.js'))

// Start server and listen it's port
app.listen(port, () => {
  console.log(`Server start and listen to port ${port}`)
})
