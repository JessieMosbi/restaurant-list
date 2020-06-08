// require modules and files
const mongoose = require('mongoose')
const restaurantList = require('../../file/restaurant.json').results
const Restaurant = require('../restaurant.js')
const User = require('../user.js')
const bcrypt = require('bcryptjs')

// DB
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
  console.log()

  // users' data
  const users = []
  users.push(new User({
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  }))
  users.push(new User({
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }))

  // user create method (非同步)
  users.map((user) => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash => {
        user.password = hash
      })
  })

  // use Promise.all to deal with promises
  Promise.all(users.map(user => user.save()))
    .then(() => {
      console.log()
      console.log('all users are done.')
      console.log()
    })

  // restaurant 與 user 對應處理 (mongodb 會自動新增每個 document 的 _id，故先去掉 json file 裡 restaurant 給的編號)
  restaurantList.forEach((restaurant) => delete restaurant.id)
  for (let i = 1; i <= restaurantList.length; i++) {
    if (i <= 3) restaurantList[i - 1].userId = users[0]._id
    else if (i >= 4 && i <= 6) restaurantList[i - 1].userId = users[1]._id
    else restaurantList[i - 1].userId = users[0]._id
  }

  // restaurant create method (非同步)
  const createRestaurant = (item) => {
    return new Promise((resolve, reject) => {
      Restaurant.create(item, (err) => {
        if (err) reject(new Error(err))
        resolve(`${item.name} create successfully`)
      })
    })
  }

  // use Promise.all to deal with promises
  Promise.all(restaurantList.map((restaurant) => createRestaurant(restaurant)))
    .then((messages) => {
      messages.forEach((message) => console.log(message))
      console.log()
      console.log('all restaurants are done.')
      process.exit()
    })
})
