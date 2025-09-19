"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BlogForm from "../components/BlogForm";
import BlogList from "../components/BlogList";

interface Blog {
  id: string;
  title: string;
  content: string;
}

const api = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${api}/api/blogs`);
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  // Create blog
  const handleCreateBlog = async (title: string, content: string) => {
    try {
      const res = await axios.post(`${api}/api/blogs`, {
        title,
        content,
      });
      setBlogs((prevBlogs) => [...prevBlogs, res.data]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating blog:", err);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id: string) => {
    try {
      await axios.delete(`${api}/api/blogs/${id}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  // Edit blog
  const handleEditBlog = async (
    id: string,
    updatedTitle: string,
    updatedContent: string
  ) => {
    try {
      const res = await axios.put(`${api}/api/blogs/${id}`, {
        title: updatedTitle,
        content: updatedContent,
      });
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog.id === id ? res.data : blog))
      );
      setEditingBlog(null);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] px-20 gap-16">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="absolute top-4 right-4 py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Create New Blog
        </button>

        {isCreateModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <BlogForm onCreate={handleCreateBlog} />
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="mt-4 w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {editingBlog && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <input
                type="text"
                value={editingBlog.title}
                onChange={(e) =>
                  setEditingBlog({ ...editingBlog, title: e.target.value })
                }
                className="w-full p-3 mb-4 border border-gray-300 rounded-md"
              />
              <textarea
                value={editingBlog.content}
                onChange={(e) =>
                  setEditingBlog({ ...editingBlog, content: e.target.value })
                }
                className="w-full p-3 mb-4 border border-gray-300 rounded-md"
              />
              <button
                onClick={() =>
                  handleEditBlog(
                    editingBlog.id,
                    editingBlog.title,
                    editingBlog.content
                  )
                }
                className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingBlog(null)}
                className="mt-2 w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 w-full">
          <BlogList
            blogs={blogs}
            onDelete={handleDeleteBlog}
            onEdit={(id, title, content) => {
              setEditingBlog({ id, title, content });
            }}
          />
        </div>
      </main>
    </div>
  );
}
