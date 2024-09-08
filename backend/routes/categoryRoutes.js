const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/categories", createCategory);

router.get("/categories", getCategories);

router.put("/categories/:id", updateCategory);

router.delete("/categories/:id", deleteCategory);

module.exports = router;
