const express = require("express");
const router = express.Router();

const Stores = require("./Stores");

router.use("/Stores", Stores);
router.get("/", (req, res) => {
  res.redirect("/Stores");
});

module.exports = router;
