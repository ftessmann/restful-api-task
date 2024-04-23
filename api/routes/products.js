const express = require("express");
const router = express.Router();
const multer = require("multer");

const ProductsController = require("../controllers/products-control");

const checkAuth = require("../middleware/check-auth");

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
router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, upload.single("productImage"), ProductsController.products_post);

// handle routes for /products/:id
router.get("/:productId", ProductsController.productsId_get);

router.patch("/:productId", checkAuth, ProductsController.productsId_update);

router.delete("/:productId", checkAuth, ProductsController.productsId_delete);

module.exports = router;