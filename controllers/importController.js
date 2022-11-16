const Import = require("./../models/importModel");
const factory = require("./handlerFactory");
// const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");

exports.getTableImport = factory.getTable(Import);
exports.createImport = factory.createOne(Import);
exports.getImport = factory.getOne(Import);
exports.getAllImports = factory.getAll(Import);
exports.updateImport = factory.updateOne(Import);
exports.deleteImport = factory.deleteOne(Import);
