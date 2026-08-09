const express = require("express");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getCategories);

// Admin only
router.post("/", protect, authorize("admin"), createCategory);

router.patch(
  "/:categoryId",
  protect,
  authorize("admin"),
  updateCategory
);

router.delete(
  "/:categoryId",
  protect,
  authorize("admin"),
  deleteCategory
);

module.exports = router;