const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).render("base");
});
router.get("/login", (req, res, next) => {
  res.status(200).render("login");
});


module.exports = router;
