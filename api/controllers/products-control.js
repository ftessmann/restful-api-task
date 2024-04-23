const mongoose = require("mongoose");

const Product = require("../routes/models/product");

exports.products_get_all = (req, res, next) => {
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
};

exports.products_post = (req, res, next) => {
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
};

exports.productsId_get = (req, res, next) => {

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
};

exports.productsId_update = (req, res, next) => {

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
};

exports.productsId_delete = (req, res, next) => {

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
};