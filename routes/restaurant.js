const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')
const { authenticated } = require('../config/auth.js')

// 使用者可以新增一家餐廳
router.get('/new', authenticated, (req, res) => {
  res.render('restaurants/edit', { action: '/restaurants' })
})
router.post('/', authenticated, (req, res) => {
  // 檢查: 每個欄位都是必填
  const blankCount = Object.values(req.body).filter((value) => value === '').length
  if (blankCount > 0) {
    const message = `尚有 ${blankCount}個欄位沒有填寫，請檢查！`
    return res.render('restaurants/edit', { restaurant: req.body, message })
  }

  const restaurant = new Restaurant(req.body)
  restaurant.userId = req.user._id
  restaurant.save((err) => {
    if (err) return console.log(err)
    return res.redirect('/')
  })
})

// 使用者可以瀏覽一家餐廳的詳細資訊
router.get('/:restaurant_id', authenticated, (req, res) => {
  Restaurant.findById(req.params.restaurant_id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.log(err)
      return res.render('restaurants/detail', { restaurant })
    })
})

// 使用者可以修改一家餐廳的資訊
router.get('/:restaurant_id/edit', authenticated, (req, res) => {
  Restaurant.findById(req.params.restaurant_id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.log(err)
      return res.render('restaurants/edit', { restaurant, action: `/restaurants/${restaurant._id}/?_method=PUT` })
    })
})
router.put('/:restaurant_id', authenticated, (req, res) => {
  // 檢查: 每個欄位都是必填
  const blankCount = Object.values(req.body).filter((value) => value === '').length
  if (blankCount > 0) {
    const message = `尚有 ${blankCount}個欄位沒有填寫，請檢查！`
    return res.render('restaurants/edit', { restaurant: req.body, message })
  }

  Restaurant.findById(req.params.restaurant_id, (err, restaurant) => {
    if (err) return console.error(err)
    // 塞值
    Object.entries(restaurant._doc).forEach(([key, value]) => {
      if (key === '_id') return
      restaurant[key] = (req.body[key]) ? req.body[key] : restaurant[key]
    })
    // 寫入
    restaurant.save((err) => {
      if (err) return console.log(err)
      return res.redirect(`/restaurants/${req.params.restaurant_id}`)
    })
  })
})

// 使用者可以刪除一家餐廳
router.delete('/:restaurant_id', authenticated, (req, res) => {
  Restaurant.findById(req.params.restaurant_id, (err, restaurant) => {
    if (err) return console.log(err)
    restaurant.remove((err) => {
      if (err) return console.log(err)
      return res.redirect('/')
    })
  })
})

module.exports = router
