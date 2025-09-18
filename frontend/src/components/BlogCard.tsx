import React from "react";

interface Blog {
  id: string;
  title: string;
  content: string;
}

interface BlogCardProps {
  blog: Blog;  
  onDelete: (id: string) => void; 
  onEdit: (id: string, updatedTitle: string, updatedContent: string) => void; 
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onDelete, onEdit }) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold">{blog.title}</h3>
      <p>{blog.content}</p>

      <button onClick={() => onEdit(blog.id, blog.title, blog.content)} className="mr-4 py-2 px-4 bg-yellow-500 text-white rounded">
        Edit
      </button>
      <button onClick={() => onDelete(blog.id)} className="py-2 px-4 bg-red-600 text-white rounded">
        Delete
      </button>
    </div>
  );
};

export default BlogCard;
