const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");

const router = express.Router();
router.use(authController.isLoggedIn);
router.get("/login",viewController.alreadyLoggedIn, (req, res, next) => {
  res.status(200).render("login");
});
router.use(viewController.errorPage);

router.get("/users",(req, res, next) => {
  res.status(200).render("user");
});
router.get("/products",(req, res, next) => {
  res.status(200).render("product");
});
router.get("/orders",(req, res, next) => {
  res.status(200).render("order");
});
router.get("/brands",(req, res, next) => {
  res.status(200).render("brand");
});
router.get("/categories",(req, res, next) => {
  res.status(200).render("category");
});
router.get("/reviews",(req, res, next) => {
  res.status(200).render("review");
});


module.exports = router;
