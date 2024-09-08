const express = require("express");
const {
  createOrUpdateOrder,
  getOrders,
  closeOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/orders", createOrUpdateOrder);

router.get("/orders", getOrders);

router.put("/orders/:orderId/close", closeOrder);

router.delete("/orders/:orderId", deleteOrder);

module.exports = router;
