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

  const user = []
  user.push(new User({
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  }))
  user.push(new User({
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }))

  user.forEach((newUser) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return console.log(err)
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return console.log(err)
        newUser.password = hash
        newUser.save((err) => {
          if (err) console.log(err)
        })
      })
    })
  })

  // 資料處理 (mongodb 會自動新增每個 document 的 _id，故先去掉 json file 裡給的編號)
  restaurantList.forEach((restaurant) => delete restaurant.id)
  for (let i = 1; i <= restaurantList.length; i++) {
    if (i <= 3) restaurantList[i].userId = user[0]._id
    else if (i >= 4 && i <= 6) restaurantList[i].userId = user[1]._id
    else break

    Restaurant.create(restaurantList[i])
    // console.log(restaurantList[i])
  }

  console.log('done')
})
