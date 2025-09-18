"use client";
import { useEffect, useState } from "react";
import BlogForm from "../components/BlogForm";
import BlogList from "../components/BlogList";

interface Blog {
  id: string;
  title: string;
  content: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blogs", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  // Create blog
  const handleCreateBlog = async (title: string, content: string) => {
    const newBlog = { title, content };
    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to create blog");
      const data = await res.json();
      setBlogs((prevBlogs) => [...prevBlogs, data]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating blog:", err);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (res.ok) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      } else {
        console.error("Failed to delete blog");
      }
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
    const updatedBlog = { title: updatedTitle, content: updatedContent };
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBlog),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to update blog");
      const data = await res.json();
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog.id === id ? data : blog))
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
                className="w-full py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
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
