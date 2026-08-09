const express = require("express");
const { uploadCourseImage } = require("../controllers/uploadController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/course-image",
  protect,
  authorize("instructor", "admin"),
  upload.single("image"),
  uploadCourseImage
);

module.exports = router;