const express = require("express");
const router = express.Router();

const db = require("../models");
const Stores = db.Store;

/*總清單頁面findAndCountAll()*/
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const offset = (page - 1) * limit;

  return Stores.findAndCountAll({
    attributes: ["id", "name", "category", "image", "rating"],
    offset: offset,
    limit: limit,
    raw: true,
  })

    .then((stores) => {
      console.log(stores);
      totalPages = Math.ceil(stores.count / limit);
      res.render("index", {
        stores: stores.rows,
        Previous: page > 1 ? page - 1 : 1,
        Next: page < totalPages ? page + 1 : totalPages,
        Page: page,
        totalPages: totalPages,
      });
    })
    .catch((err) => res.status(422).json(err));
});
/*單一detail*/
router.get("/storeDetail/:id", (req, res) => {
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
    .then((Store) => res.render("detail", { Store: Store }))
    .catch((err) => res.status(422).json(err));
});
/*Create新增頁面*/
router.get("/create", (req, res) => {
  res.render("create", { error: req.flash("error") });
});
router.post("/newStores", (req, res, next) => {
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
    .then(() => {
      req.flash("success", "新增成功!!!!!!!!!!!!");
      res.redirect("/Stores");
    })
    .catch((err) => {
      error.errorMessage = "新增失敗:((((((((((((";
      next(error);
    });
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
    .then((store) =>
      res.render("editStores", { store: store, error: req.flash("error") })
    )
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
    .then(() => {
      req.flash("success", "編輯成功!!!!!!!!!!!!");
      res.redirect("/Stores");
    })
    .catch((err) => {
      error.errorMessage = "編輯失敗:(((((((((((((";
      next(error);
    });
});
/*刪除*/
router.delete("/deleteStore/:id", (req, res) => {
  const id = req.params.id;
  return Stores.destroy({ where: { id } })
    .then(() => {
      req.flash("success", "刪除成功!!!!!!!!!!!!");
      res.redirect("/Stores");
    })
    .catch((err) => console.log(err));
});

/*搜尋*/
router.get("/search", (req, res) => {
  if (!req.query.keyword) {
    return res.redirect("/");
  }
  const keywords = req.query.keyword;
  const keyword = keywords.trim().toLowerCase();
  console.log(keywords, keyword); //顯示表單所輸入的關鍵字

  return Stores.findAll({
    attributes: ["name", "category", "image", "rating"],
    raw: true,
  })
    .then((StoresData) => {
      console.log(StoresData); //顯示Stores.findAll結果
      const filterStoresData = StoresData.filter(
        (data) =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      );
      console.log(filterStoresData); //顯示StoresData.filter結果
      res.render("index", {
        stores: filterStoresData,
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
