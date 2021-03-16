const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: `Order not for this ID ${id}`,
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  console.log("I Am in Create Order");

  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  // console.log("USER ", order);

  order.save((err, order) => {
    if (err) {
      // console.log("i am in save order", err);

      return res.status(400).json({
        error: "Failed to save order in DB",
      });
      // console.log("i am in save order");
    }
    res.json(order);
  });
};

exports.getAllOrder = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ error: "No Order found" });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  //
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  //UpdateOne =Update in Hitesh
  Order.updateOne(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot update order status",
        });
      }
      res.json(order);
    }
  );
};
