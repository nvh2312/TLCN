const Import = require("./../models/importModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
exports.setImporter = (req, res, next) => {
  if (!req.user)
    return next(
      new AppError("Bạn không có quyền thực hiện"),
      403
    );
  req.body.invoice = JSON.parse(req.body.invoice);
  req.body.user = req.user;
  next();
};

exports.getTableImport = factory.getTable(Import);
exports.createImport = factory.createOne(Import);
exports.getImport = factory.getOne(Import);
exports.getAllImports = factory.getAll(Import);
exports.updateImport = factory.updateOne(Import);
exports.deleteImport = factory.deleteOne(Import);
exports.sumImport = catchAsync(async (req, res, next) => {
  const data = await Import.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total_month: { $sum: "$totalPrice" },
        // bookings_month: {
        //   $push: {
        //     each_order: "$totalPrice",
        //   },
        // },
      },
    },
  ]);
  res.status(200).json(data);
});
