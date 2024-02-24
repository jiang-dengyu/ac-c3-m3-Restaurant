const express = require("express");
const router = express.Router();

const db = require("../models");
const Stores = db.Store;

router.get("/", (req, res) => {
  return Stores.findAll({
    attribute: ["id", "name", "name_en", "image"],
    raw: true,
  })
    .then((stores) => res.render("index", { stores: stores }))
    .catch((err) => res.status(422).json(err));
});
/*搜尋*/
/*router.get('/search',(req,res)=>{
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
router.get("/storeDetail/:id", (req, res) => {
  const id = req.params.id;
  return Stores.findByPk(id, {
    attributes: [
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
    ],
    raw: true,
  })
    .then((Store) => res.render("detail", { Store: Store }))
    .catch((err) => res.status(422).json(err));
});
/*Create新增頁面*/
router.get("/create", (req, res) => {
  res.render("create");
});
router.post("/newStores", (req, res) => {
  const {
    name,
    name_en,
    category,
    location,
    image,
    phone,
    google_map,
    rating,
    description,
  } = req.body;
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
  })
    .then(() => res.redirect("/Stores"))
    .catch((err) => console.log(err));
});
/*Edit編輯頁面*/
router.get("/editStores/:id", (req, res) => {
  const id = req.params.id;
  return Stores.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
    ],
    raw: true,
  })
    .then((store) => res.render("editStores", { store: store }))
    .catch((err) => console.log(err));
});
router.put("/editStores/:id/edit", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  return Stores.update(
    {
      name: body.name,
      name_en: body.name_en,
      category: body.category,
      image: body.image,
      location: body.location,
      phone: body.phone,
      google_map: body.google_map,
      rating: body.rating,
      description: body.description,
    },
    { where: { id } }
  )
    .then(() => res.redirect("/Stores"))
    .catch((err) => console.log(err));
});
/*刪除*/
router.delete("/deleteStore/:id", (req, res) => {
  const id = req.params.id;
  return Stores.destroy({ where: { id } })
    .then(() => res.redirect("/Stores"))
    .catch((err) => console.log(err));
});

module.exports = router;
