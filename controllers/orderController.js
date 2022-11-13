const Order = require("./../models/orderModel");
const factory = require("./handlerFactory");


exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.deleteOrder = factory.deleteOne(Order);