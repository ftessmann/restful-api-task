const mongoose = require("mongoose");

const Order = require("../routes/models/order");
const Product = require("../routes/models/product");

exports.orders_get_all = (req, res, next) => {
    Order.find()
         .select("product quantity _id vendor")
         .populate("product", "name")
         .exec()
         .then(docs => {
            res.status(200).json({
                count: docs.lenght,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        vendor: doc.vendor,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                }),
            });
         })
         .catch(err => {
            res.status(500).json({
                error: err
            })
         })
    };

exports.orders_post = (req, res, next) => {
    Product.findById(req.body.productId)
           .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
                vendor: req.body.vendor
            });
            return order.save()
        })

        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order created",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    vendor: result.vendor
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
         })
         .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
         })
};

exports.ordersId_get = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate("product")
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.orderId_delete = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: { productId: "ID", quantity: "Number" }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};