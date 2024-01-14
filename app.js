const express = require('express')
const app = express()
const port = 3000
const {engine} = require('express-handlebars')
const restaurants = require('./public/jsons/restaurant.json').results


app.engine('.hbs', engine({extname:'.hbs'}))
app.set('view engine','.hbs')
app.set('views','./views')
app.use(express.static('public'))

app.get('/',(req,res)=>{
  //res.redirect('/restaurants')
  res.render('index',{restaurants})
})

app.get('/search',(req,res)=>{
  const keyword = req.query.keyword || ' '
  const matchedRT = restaurants.filter((RT) => RT.name.toLowerCase().includes(keyword.toLowerCase()))
  res.render('index', { restaurants: matchedRT, keyword })
})

app.get('/restaurant/:id',(req,res)=>{
  const id = req.params.id
  const restaurant = restaurants.find((restaurant) =>restaurant.id.toString() === id)
  res.render('detail',{restaurant})

})

app.listen(port,()=>{
  console.log(`express server is running on http://localhost:${port}`)
})
