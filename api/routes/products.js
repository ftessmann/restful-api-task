const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("./models/product");

// handle router for /products
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling GET to /products"
    });
});

router.post("/", (req, res, next) => {
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    })

    res.status(201).json({
        message: "Handling POST to /products",
        createdProduct: product
    });
});

// handle router for /products/:id
router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    if (id === "special") {
        res.status(200).json({
            message: "This is the special ID",
            id: id
        });
    } else {
        res.status(200).json({
            message: "You passed and ID"
        });
    }
});

router.patch("/:productId", (req, res, next) => {
    res.status(201).json({
        message: "Product updated"
    });
});

router.delete("/:productId", (req, res, next) => {
    res.status(200).json({
        message: "Product deleted"
    });
});

module.exports = router;