const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const multer = require('multer')

const uploadFiles = upload.fields([{ name: "images", maxCount: 5 }]);
exports.uploadProductImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new AppError("Too many files to upload.", 400),false);
      }
    } else if (err) {
      return next(new AppError("Upload failed.", 400),false);
    }

    next();
  });
};

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const result = await cloudinary.uploader.upload(file.path);
      req.body.images.push(result.url);
    })
  );

  next();
});
exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,priceDiscount,ratingsAverage,title";
  next();
};
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: "reviews" });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.getTableProduct = factory.getTable(Product);
