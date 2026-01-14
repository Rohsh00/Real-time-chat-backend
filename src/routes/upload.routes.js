const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "chat_uploads",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Upload failed" });
        }

        return res.status(200).json({
          fileUrl: result.secure_url,
          fileName: req.file.originalname,
          fileSize: req.file.size,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
