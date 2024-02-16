const express = require('express')
const app = express()
const port = 3000

const db = require('./models')
const Stores = db.store

const {engine} = require('express-handlebars')
app.engine('.hbs', engine({extname:'.hbs'}))
app.set('view engine','.hbs')
app.set('views','./views')

/*首頁全部清單*/
app.get('/',(req,res)=>{
  return Stores.findAll()
    .then((restaurant)=>res.send('index'))
    .catch((err) => res.status(422).json(err))
})

/*搜尋*/
/*app.get('/search',(req,res)=>{
  const keyword = req.query.keyword || ' '
  const matchedRT = keyword ? restaurants.filter((RT) => 
    Object.values(RT).some((property) => {
      if (typeof property === 'string') {
        return property.toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })  
  ):restaurants
  res.render('index', { restaurants: matchedRT, keyword })
})*/

/*單一detail*/
/*app.get('/restaurant/:id',(req,res)=>{
  const id = req.params.id
  const restaurant = restaurants.find((restaurant) =>restaurant.id.toString() === id)
  res.render('detail',{restaurant})

})*/

app.listen(port,()=>{
  console.log(`express server is running on http://localhost:${port}`)
})
