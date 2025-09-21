"use client";
import React from "react";
import BlogCard from "./BlogCard";

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

interface BlogListProps {
  blogs: Blog[]; 
  onDelete?: (id: string) => void; 
  onEdit?: (id: string, updatedTitle: string, updatedContent: string) => void; 
}

const BlogList: React.FC<BlogListProps> = ({ blogs, onDelete, onEdit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog} 
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default BlogList;