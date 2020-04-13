const sorts = [
  {
    id: 1,
    column: 'name',
    name: 'A -> Z',
    type: 'asc',
    select: null
  },
  {
    id: 2,
    column: 'name',
    name: 'Z -> A',
    type: 'desc',
    select: null
  },
  {
    id: 3,
    column: 'category',
    name: '類別',
    type: 'asc',
    select: null
  },
  {
    id: 4,
    column: 'location',
    name: '地區',
    type: 'asc',
    select: null
  }
]
const script = `
  <script>
  const cardContent = document.getElementById('card-content')
  cardContent.addEventListener('click', () => {
    if (event.target.dataset.type === "delete-btn") {
      if (confirm('刪除後即無法復原，您確定要刪除此餐廳嗎？')) {
        event.target.closest('.delete-restaurant-form').submit()
      }
    }
  })

  const sortMenu = document.getElementById('sort-menu')
  const input = document.querySelector('input[name="sortType"]')
  const form = document.getElementById('filter-form')
  sortMenu.addEventListener('click', () => {
    input.value = event.target.dataset.id
    form.submit()
  })
  </script>
`
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')
const { authenticated } = require('../config/auth.js')

// 使用者可以瀏覽全部所有餐廳 (includes 搜尋、排序)
router.get('/', authenticated, (req, res) => {
  // 搜尋
  const keyword = req.query.keyword
  const findCondition = (keyword) ? { name: { $regex: '.*' + keyword + '.*', $options: 'i' } } : {} // 去 DB 用 SQL LIKE 找 data ({欄位名稱: {LIKE: %keyword%}})，ignore 大小寫
  findCondition.userId = req.user._id

  // 排序
  const sortType = req.query.sortType
  const sortCondition = {} // {column name: ASC/DESC}
  sorts.forEach((sort, index) => {
    if (String(sort.id) === sortType) {
      sortCondition[sort.column] = sort.type
      sorts[index].select = true
    } else sorts[index].select = null
  })

  Restaurant.find(findCondition) // 查找資料
    .sort(sortCondition) // 排序資料
    .lean() // 整理資料
    .exec((err, restaurants) => { // 抓回資料
      if (err) return console.log(err)
      res.render('index', { restaurant: restaurants, script, sort: sorts, sortType, keyword })
    })
})

module.exports = router
