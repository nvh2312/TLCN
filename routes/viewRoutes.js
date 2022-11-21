const express = require("express");
// const AppError = require("./../utils/appError");
// const catchAsync = require("./../utils/catchAsync");
// const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");
const Order = require("../models/orderModel");
const Import = require("../models/importModel");
const passport = require("../utils/passport");

const router = express.Router();
router.use(authController.isLoggedIn);

router.get("/login", viewController.alreadyLoggedIn, (req, res, next) => {
  res.status(200).render("login");
});
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  viewController.googleLogin
);
// router.get("/google/callback", passport.authenticate("google"), (req, res) => {
//   res.redirect("/");
// });
router.use(viewController.errorPage);
router.get("/", (req, res, next) => {
  res.status(200).render("dashboard");
});
router.get("/users", (req, res, next) => {
  res.status(200).render("user");
});
router.get("/products", (req, res, next) => {
  res.status(200).render("product");
});
router.get("/orders", (req, res, next) => {
  res.status(200).render("order");
});
router.get("/orders/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Order.findById(id);
    let total = 0;
    data.cart.forEach((value) => {
      total += value.product.price * value.quantity;
    });
    data.total = total;
    const theDate = new Date(Date.parse(data.createdAt));
    const date = theDate.toLocaleString();
    data.date = date;
    data.discount = total - data.totalPrice;
    res.status(200).render("orderDetail", { data });
  } catch (error) {
    res.status(200).render("404");
  }
});
router.get("/imports", (req, res, next) => {
  res.status(200).render("import");
});
router.get("/imports/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Import.findById(id);
    const theDate = new Date(Date.parse(data.createdAt));
    const date = theDate.toLocaleString();
    data.date = date;
    res.status(200).render("importDetail", { data });
  } catch (error) {
    res.status(200).render("404");
  }
});
router.get("/brands", (req, res, next) => {
  res.status(200).render("brand");
});
router.get("/categories", (req, res, next) => {
  res.status(200).render("category");
});
router.get("/reviews", (req, res, next) => {
  res.status(200).render("review");
});

module.exports = router;
