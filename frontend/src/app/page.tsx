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

export default function Home() {
  const api = process.env.NEXT_PUBLIC_API_URL || ""; 
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setErrorMessage(null);
        const res = await axios.get(`${api}/api/blogs`, {
          timeout: 10000,
        });
        setBlogs(res.data);
      } catch (err: any) {
        console.error("Error fetching blogs:", err);
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setErrorMessage(
              `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
            );
          } else if (err.request) {
            setErrorMessage("No response from backend. It might be down.");
          } else {
            setErrorMessage(err.message);
          }
        } else {
          setErrorMessage("Unexpected error occurred.");
        }
      }
    };

    fetchBlogs();
  }, [api]);

  const handleCreateBlog = async (title: string, content: string) => {
    try {
      setErrorMessage(null);
      const res = await axios.post(`${api}/api/blogs`, { title, content });
      setBlogs(prev => [...prev, res.data]);
      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error("Error creating blog:", err);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data?.error || "Error creating blog");
      } else {
        setErrorMessage("Unexpected error creating blog");
      }
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      setErrorMessage(null);
      await axios.delete(`${api}/api/blogs/${id}`);
      setBlogs(prev => prev.filter(blog => blog.id !== id));
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data?.error || "Error deleting blog");
      } else {
        setErrorMessage("Unexpected error deleting blog");
      }
    }
  };

  const handleEditBlog = async (
    id: string,
    updatedTitle: string,
    updatedContent: string
  ) => {
    try {
      setErrorMessage(null);
      const res = await axios.put(`${api}/api/blogs/${id}`, {
        title: updatedTitle,
        content: updatedContent,
      });
      setBlogs(prev =>
        prev.map(blog => (blog.id === id ? res.data : blog))
      );
      setEditingBlog(null);
    } catch (err: any) {
      console.error("Error updating blog:", err);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data?.error || "Error updating blog");
      } else {
        setErrorMessage("Unexpected error updating blog");
      }
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

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

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
