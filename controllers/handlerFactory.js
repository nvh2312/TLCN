const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Product = require("./../models/productModel");
const Review = require("./../models/reviewModel");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {


    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    if (Model == Review) {
      Model.calcAverageRatings(doc.product)
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
    }
    
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (Model == Review) {
      Model.calcAverageRatings(doc.product)
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
    console.log(req.body);
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

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
exports.getTable = (Model) =>
  catchAsync(async (req, res, next) => {
    let searchStr = req.query.search["value"];
    if (searchStr) {
      const regex = new RegExp(searchStr);
      searchStr = { $or: [{ name: regex }] };
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
