const express = require("express");
const router = express.Router();

// handle router for /orders
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "GET order"
    });
});

router.post("/", (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity,
        vendor: req.body.vendor
    }
    res.status(201).json({
        message: "POST order",
        createdOrder: order
    });
});

// handle router for /orders/:id
router.get("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "GET orderId",
        orderId: req.params.orderId
    });
});

router.delete("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "DELETE order",
        orderId: req.params.orderId
    });
});


module.exports = router;