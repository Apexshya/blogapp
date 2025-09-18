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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  const handleCreateBlog = async (title: string, content: string) => {
    const newBlog = { title, content };
    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlog),
      });
      const data = await res.json();
      setBlogs((prevBlogs) => [...prevBlogs, data]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating blog:", err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleEditBlog = async (id: string, updatedTitle: string, updatedContent: string) => {
    const updatedBlog = { title: updatedTitle, content: updatedContent };
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBlog),
      });
      const data = await res.json();
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog.id === id ? data : blog))
      );
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] px-20 gap-16">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Create New Blog
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <BlogForm onCreate={handleCreateBlog} />
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 w-full">
          <BlogList blogs={blogs} onDelete={handleDeleteBlog} onEdit={handleEditBlog} />
        </div>
      </main>
    </div>
  );
}
