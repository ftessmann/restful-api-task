const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Product = require("./models/product");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

// filters uploaded files
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png"
    ) 
        {
            cb(null, true)
        }
        else 
        {
            cb(null, false);
        }

};

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});

// handle routes for /products
router.get("/", (req, res, next) => {
    Product.find()
        .select("name price _id category productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        category: doc.category,
                        productImage: doc.productImage,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc.id
                        }
                    }
                })
            };
                res.status(200).json(response);
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
                });
            });
});
        

router.post("/", upload.single("productImage"), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        productImage: req.file.path
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Product created!",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    category: result.category,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + result.id
                    }
                }
            });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

// handle routes for /products/:id
router.get("/:productId", (req, res, next) => {

    const id = req.params.productId;

    Product.findById(id)
    .select("name price category _id productImage")
    .exec()
    .then(doc => {
        console.log("From DB", doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products"
                }
            });
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
        res.status(200).json({
            message: "Product updated",
            request : {
                type: "GET",
                url: "http://localhost:3000/products/" + id
            }
        });
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
            message: "Product deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/products",
                body: { name: "String", price: "Number", category: "String" }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })

    
});

module.exports = router;