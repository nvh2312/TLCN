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
router.get("/products",(req, res, next) => {
  res.status(200).render("product");
});


module.exports = router;
