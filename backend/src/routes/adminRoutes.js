const express = require("express");
const {
  getDashboard,
  getUsers,
  updateUserRole,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.patch("/users/:userId/role", updateUserRole);

module.exports = router;