const express = require('express')
const app = express()
const port = 3000
app.use(express.static('public'))

const db = require('./models')
const Stores = db.Store

const {engine} = require('express-handlebars')
app.engine('.hbs', engine({extname:'.hbs'}))
app.set('view engine','.hbs')
app.set('views','./views')

app.use(express.urlencoded({ extended: true }))


/*首頁全部清單*/
app.get('/',(req,res)=>{
  res.redirect('/Stores')
})
app.get('/Stores',(req,res)=>{
  return Stores.findAll({
    attribute:['id','name','name_en','image'],
    raw:true,
  })
    .then((stores)=>res.render('index',{stores:stores}))
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
app.get('/storeDetail/:id',(req,res)=>{
  const id = req.params.id
  return Stores.findByPk(id,{
    attributes:['name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true,
  })
    .then((Store)=>res.render('detail',{Store:Store}))
    .catch((err) => res.status(422).json(err))
})
/*Create新增頁面*/
app.get('/create',(req,res)=>{
  res.render('create')
})
app.post('/newStores',(req,res)=>{
  const { name, name_en, category, location, image, phone, google_map, rating, description } = req.body;
  return Stores.create({
    name:name,
    name_en:name_en, 
    category:category, 
    location:location, 
    image:image, 
    phone:phone, 
    google_map:google_map, 
    rating:rating,
    description:description,
  })
    .then(()=> res.redirect('/Stores'))
    .catch((err) => console.log(err))
})


app.listen(port,()=>{
  console.log(`express server is running on http://localhost:${port}`)
})
