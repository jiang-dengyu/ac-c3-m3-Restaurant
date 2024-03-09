const express = require('express')
const router = express.Router()

const db = require('../models')
const Stores = db.Store

/*總清單頁面findAndCountAll()*****************************/
router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 6
  const offset = (page - 1) * limit
  const userId = req.user.id
  let order
  if (req.query.sortBy) {
    if (req.query.sortBy === 'asc') {
      order = [['rating', 'ASC']]
    } else if (req.query.sortBy === 'desc') {
      order = [['rating', 'DESC']]
    }
  }

  return Stores.findAndCountAll({
    attributes: ['id', 'name', 'category', 'image', 'rating'],
    where: { userId },
    offset: offset,
    limit: limit,
    order: order,
    raw: true
  })
    .then((stores) => {
      console.log(stores)
      totalPages = Math.ceil(stores.count / limit)
      res.render('index', {
        stores: stores.rows,
        Previous: page > 1 ? page - 1 : 1,
        Next: page < totalPages ? page + 1 : totalPages,
        Page: page,
        totalPages: totalPages,
        sortBy: req.query.sortBy || ''
      })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})
/*單一detail********************************************************************/
router.get('/storeDetail/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id
  return Stores.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })
    .then((Store) => {
      if (!Store) {
        req.flash('error', '找不到資料')
        return res.render('/Stores')
      }
      if (Store.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/Stores')
      }
      res.render('detail', { Store: Store })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})
/*Create新增頁面********************************************************************/
router.get('/create', (req, res) => {
  res.render('create', { error: req.flash('error') })
})
router.post('/newStores', (req, res, next) => {
  const { name, name_en, category, location, image, phone, google_map, rating, description } = req.body
  const userId = req.user.id
  return Stores.create({
    name: name,
    name_en: name_en,
    category: category,
    location: location,
    image: image,
    phone: phone,
    google_map: google_map,
    rating: rating,
    description: description,
    userId: userId
  })

    .then(() => {
      req.flash('success', '新增成功!!!!!!!!!!!!')
      res.redirect('/Stores')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗:(((((((((((('
      next(error)
    })
})
/*Edit編輯頁面********************************************************************/
router.get('/editStores/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id
  return Stores.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })
    .then((Store) => {
      if (!Store) {
        req.flash('error', '找不到資料')
        return res.render('/Stores')
      }
      if (Store.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/Stores')
      }
      res.render('editStores', { Store: Store, error: req.flash('error') })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})
router.put('/editStores/:id/edit', (req, res) => {
  const body = req.body
  const id = req.params.id
  const userId = req.user.id

  return Stores.findByPk(id, {
    attributes: [id, 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })
    .then((Store) => {
      if (!Store) {
        req.flash('error', '找不到資料')
        return res.render('/Stores')
      }
      if (Store.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/Stores')
      }
      return Stores.update({
        name: body.name,
        name_en: body.name_en,
        category: body.category,
        image: body.image,
        location: body.location,
        phone: body.phone,
        google_map: body.google_map,
        rating: body.rating,
        description: body.description
      }).then(() => {
        req.flash('success', '編輯成功!!!!!!!!!!!!')
        res.redirect('/Stores')
      })
    })
    .catch((error) => {
      error.errorMessage = '編輯失敗:((((((((((((('
      next(error)
    })
})
/*刪除********************************************************************/
router.delete('/deleteStore/:id', (req, res) => {
  const id = req.params.id
  return Stores.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功!!!!!!!!!!!!')
      res.redirect('/Stores')
    })
    .catch((err) => console.log(err))
})

/*搜尋********************************************************************/
router.get('/search', (req, res) => {
  if (!req.query.keyword) {
    return res.redirect('/')
  }
  const keywords = req.query.keyword
  const keyword = keywords.trim().toLowerCase()
  console.log(keywords, keyword) //顯示表單所輸入的關鍵字

  return Stores.findAll({
    attributes: ['name', 'category', 'image', 'rating'],
    raw: true
  })
    .then((StoresData) => {
      console.log(StoresData) //顯示Stores.findAll結果
      const filterStoresData = StoresData.filter((data) => data.name.toLowerCase().includes(keyword) || data.category.includes(keyword))
      console.log(filterStoresData) //顯示StoresData.filter結果
      res.render('index', {
        stores: filterStoresData
      })
    })
    .catch((err) => console.log(err))
})

module.exports = router
