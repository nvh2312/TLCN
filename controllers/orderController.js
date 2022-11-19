const Order = require("./../models/orderModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.checkStatusOrder = catchAsync(async (req, res, next) => {
  if (
    req.user.role == "user" &&
    ((req.body.status == "Cancelled" && req.order.status != "Processed") ||
      req.body.status != "Cancelled")
  ) {
    return next(
      new AppError("Bạn không có quyền thực hiện.", 403)
    );
  }
  if (req.order.status == "Cancelled" || req.order.status == "Success") {
    return next(new AppError(`Đơn hàng nãy đã ${req.order.status}`, 403));
  }
  next();
});
exports.getTableOrder = factory.getTable(Order);
exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.isOwner = factory.checkPermission(Order);
exports.setUser = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user;
  next();
};
