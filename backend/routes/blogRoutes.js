const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

router.use(protect);

router.post("/", authorize('admin'), createBlog);
router.put("/:id", updateBlog); 
router.delete("/:id", deleteBlog); 

module.exports = router;
