const Blog = require("../models/Blog");

const formatBlog = (blog) => ({
  id: blog._id.toString(),
  title: blog.title,
  content: blog.content,
  author: blog.author
});

exports.createBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newBlog = new Blog({ 
      title, 
      content,
      author: req.user.id 
    });
    await newBlog.save();
    
    await newBlog.populate('author', 'username email role');
    
    res.status(201).json(formatBlog(newBlog));
  } catch (err) {
    res.status(400).json({ error: "Error creating blog" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username email role');
    res.status(200).json(blogs.map(formatBlog));
  } catch (err) {
    res.status(400).json({ error: "Error fetching blogs" });
  }
};

exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate('author', 'username email role');
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.status(200).json(formatBlog(blog));
  } catch (err) {
    res.status(400).json({ error: "Error fetching blog" });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    
    if (req.user.role !== 'admin' && blog.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    ).populate('author', 'username email role');
    
    res.status(200).json(formatBlog(updatedBlog));
  } catch (err) {
    res.status(400).json({ error: "Error updating blog" });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    
    if (req.user.role !== 'admin' && blog.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this blog" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting blog" });
  }
};






