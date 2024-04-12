const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("./models/product");

// handle router for /products
router.get("/", (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.lenght >= 0) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({
                    message: "No entries found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Product created!",
                createdProduct: result
            });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

// handle router for /products/:id
router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From DB", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: "No product found"});
        };
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch("/:productId", (req, res, next) => {

    const id = req.params.productId;
    const updateOps = {};
    
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    };

    Product.updateOne({ _id: id }, { 
        $set: updateOps 
    },
    {
        new: true
    }
    )
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            error: err
        })
    })
});

router.delete("/:productId", (req, res, next) => {

    const id = req.params.productId;

    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            result,
            message: "Product deleted"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })

    
});

module.exports = router;