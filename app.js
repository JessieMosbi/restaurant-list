// Set params
const port = 3000

// Load module and file
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const routes = require('./routes/index.js')
const usePassport = require('./config/passport.js')

// DB
require('./config/mongoose')

// Set express module
const app = express()
// 判別開發環境: 如果不是 production，就透過 dotenv 讀取 .env file
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Set express handlebars module
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // define engine and its layout
app.set('view engine', 'hbs') // set engine
app.use(bodyParser.urlencoded({ extended: true })) // Use body-parser to parse POST data
app.use(express.static('public')) // Where to find static file directory
app.use(methodOverride('_method')) // Use method-override to make RESTful routes

app.use(session({
  secret: 'Jessie oepwqnfqughqp34ug',
  resave: false,
  saveUninitialized: true
}))

app.use(flash())

// Set authentication
usePassport(app)

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
app.use(routes)

// Start server and listen it's port
app.listen(port, () => {
  console.log(`Server start and listen to port ${port}`)
})
