const path = require("path");
const crypto = require("crypto");
const supabaseAdmin = require("../config/supabaseAdmin");

const uploadCourseImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const extension = path.extname(req.file.originalname).toLowerCase();
    const filePath = `course-images/${req.user.id}/${crypto.randomUUID()}${extension}`;

    const { error } = await supabaseAdmin.storage
      .from("course-images")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return res.status(500).json({ message: "Could not upload image" });
    }

    const { data } = supabaseAdmin.storage
      .from("course-images")
      .getPublicUrl(filePath);

    res.status(201).json({
      message: "Image uploaded successfully",
      imageUrl: data.publicUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message || "Upload failed" });
  }
};

module.exports = { uploadCourseImage };