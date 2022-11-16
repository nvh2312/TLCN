const Import = require("./../models/importModel");
const factory = require("./handlerFactory");
// const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
exports.setImporter = (req, res, next) => {
  if (!req.user)
    return next(
      new AppError("You don't have permission to do this action"),
      403
    );
  console.log(req.body.invoice);
  req.body.invoice = JSON.parse(req.body.invoice);
  console.log(req.body.invoice);
  req.body.user = req.user;
  next();
};

exports.getTableImport = factory.getTable(Import);
exports.createImport = factory.createOne(Import);
exports.getImport = factory.getOne(Import);
exports.getAllImports = factory.getAll(Import);
exports.updateImport = factory.updateOne(Import);
exports.deleteImport = factory.deleteOne(Import);
