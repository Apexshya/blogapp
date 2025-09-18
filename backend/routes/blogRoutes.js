
const express = require("express");
const Blog = require("../models/Blog");

const router = express.Router();

router.post("/", async (req, res) => {
  const { title, content } = req.body;

  try {
    const newBlog = new Blog({ title, content });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ error: "Error creating blog" });
  }
});

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(400).json({ error: "Error fetching blogs" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(400).json({ error: "Error fetching blog" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(400).json({ error: "Error updating blog" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting blog" });
  }
});

module.exports = router;
