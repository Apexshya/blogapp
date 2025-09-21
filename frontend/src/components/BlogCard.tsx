import React from "react";
import { useAuth } from "../context/AuthContext";

interface Blog {
  id: string;
  title: string;
  content: string;
  author?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

interface BlogCardProps {
  blog: Blog;  
  onDelete?: (id: string) => void; 
  onEdit?: (id: string, updatedTitle: string, updatedContent: string) => void; 
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onDelete, onEdit }) => {
  const { user } = useAuth();

  const canEditOrDelete = user && (user.role === 'admin' || user.id === blog.author?.id);

  return (
    <div className="p-6 border border-gray-300 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h3>
      {blog.author && (
        <p className="text-gray-600 text-sm mb-2">By: {blog.author.username}</p>
      )}
      <p className="text-gray-700 mb-6">{blog.content}</p>

      {canEditOrDelete && (
        <div className="flex space-x-4">
          {onEdit && (
            <button
              onClick={() => onEdit(blog.id, blog.title, blog.content)}
              className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(blog.id)}
              className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogCard;

