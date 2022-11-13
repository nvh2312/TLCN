const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Product = require("./../models/productModel");
const Review = require("./../models/reviewModel");
const Order = require("./../models/orderModel");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    if (Model == Review) {
      Model.calcAverageRatings(doc.product);
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model == Product) {
      req.body.updatedBy = req.user.id;
      req.body.updatedAt = Date.now() - 1000;
      req.body.description = req.body.description
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      if (req.body.promotion >= req.body.price)
        return next(new AppError("Giá giảm phải nhỏ hơn giá gốc", 500));
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: false,
      });
      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    }
    if (Model == Order && req.body.status == "Cancelled") {
      const cart = req.order.cart;
      for (const value of cart) {
        console.log(value.product._id);
        await Product.findByIdAndUpdate(value.product._id, {
          $inc: { inventory: value.quantity },
        });
      }
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (Model == Review) {
      Model.calcAverageRatings(doc.product);
    }

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model == Product) {
      req.body.createdBy = req.user.id;
    }
    if (Model == Order) {
      const cart = req.body.cart;
      for (const value of cart) {
        const name =
          value.product.title.length > 39
            ? value.product.title.slice(0, 40)
            : value.product.title;
        const invent = await Product.findById(value.id);
        if (value.quantity > invent.inventory) {
          return next(
            new AppError(`Số lượng hàng ${name} trong kho không đủ`, 500)
          );
        }
      }

      const doc = await Model.create(req.body);
      for (const value of cart) {
        await Product.findByIdAndUpdate(value.id, {
          $inc: { inventory: -value.quantity },
        });
      }

      return res.status(201).json({
        status: "success",
        data: {
          id: doc.id,
          totalPrice: doc.totalPrice,
        },
      });
    }
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    let totalPage = 1;

    if (Model == Review && req.params.productId) {
      const more = await Product.findById(req.params.productId).populate({
        path: "reviews",
      });
      const totalFilter = more.reviews.length;
      if (req.query.page != undefined) {
        totalPage = Math.ceil(totalFilter / Number(req.query.limit));
      }
      if (req.query.page > totalPage)
        return next(new AppError("This page does not exist", 404));
      return res.status(200).json({
        status: "success",
        data: {
          data: doc,
          results: doc.length,
          ratingsQuantity: more.ratingsQuantity,
          ratingsAverage: more.ratingsAverage,
          eachRating: more.eachRating,
          totalPage,
        },
      });
    }

    if (req.query.page != undefined) {
      const filterModel = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields();
      const filterData = await filterModel.query;
      totalPage = Math.ceil(filterData.length / Number(req.query.limit));
      if (req.query.page > totalPage)
        return next(new AppError("This page does not exist", 404));
    }
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
      totalPage,
    });
  });
exports.getTable = (Model) =>
  catchAsync(async (req, res, next) => {
    let searchStr = req.query.search["value"];
    if (searchStr) {
      const regex = new RegExp(searchStr);
      searchStr = { $or: [{ title: regex }] };
    } else {
      searchStr = {};
    }
    Model.count({}, function (err, c) {
      const recordsTotal = c;
      Model.count(searchStr, function (err, c) {
        const recordsFiltered = c;
        Model.find(
          searchStr,
          "",
          { skip: Number(req.query.start), limit: Number(req.query.length) },
          function (err, results) {
            if (err) {
              return;
            }
            const data = {
              draw: req.query.draw,
              recordsFiltered: recordsFiltered,
              recordsTotal: recordsTotal,
              data: results,
            };
            res.status(200).json(data);
          }
        );
      });
    });
  });
exports.checkPermission = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Get review id from param and findById to get review information
    const doc = await Model.findById(req.params.id);
    // 2) if user is owner, allow to update or delete data
    if (req.user.id != doc.user._id && req.user.role == "user") {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    if (Model == Order) {
      req.order = doc;
    }
    next();
  });
