const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.errorPage = (req, res, next) => {
  if (res.locals.user == undefined) {
    return res.redirect("/login");
  }
  if (res.locals.user.role != "admin") {
    return res.redirect("/error");
  }
  next();
};
exports.alreadyLoggedIn = (req, res, next) => {
  if (res.locals.user != undefined && res.locals.user.role == "admin")
    return res.redirect("/");
  next();
};
