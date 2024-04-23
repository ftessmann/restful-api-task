const express = require("express");
const router = express.Router();


const checkAuth = require("../middleware/check-auth");

const OrdersController = require("../controllers/orders-control");

// handle router for /orders
router.get("/", checkAuth, OrdersController.orders_get_all);

router.post("/", checkAuth, OrdersController.orders_post);
    
// handle router for /orders/:id
router.get("/:orderId", checkAuth, OrdersController.ordersId_get);

router.delete("/:orderId", checkAuth, OrdersController.orderId_delete);


module.exports = router;