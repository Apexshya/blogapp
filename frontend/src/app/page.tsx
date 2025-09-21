// "use client";

// import { useEffect, useState } from "react";
// import axios, { AxiosError } from "axios";
// import { useAuth } from "../context/AuthContext";
// import BlogForm from "../components/BlogForm";
// import BlogList from "../components/BlogList";
// import LoginForm from "../components/LoginForm";
// import RegisterForm from "../components/RegisterForm";

// interface Blog {
//   id: string;
//   title: string;
//   content: string;
//   author?: {
//     id: string;
//     username: string;
//     email: string;
//     role: string;
//   };
// }

// export default function Home() {
//   const api = (process.env.NEXT_PUBLIC_API_URL || "")
//   const { user, loading, logout } = useAuth();
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isLoginMode, setIsLoginMode] = useState(true);

//   // Axios auth header setup
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }

//     const responseInterceptor = axios.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401) {
//           logout();
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.response.eject(responseInterceptor);
//     };
//   }, [logout]);

//   // Fetch blogs
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         setErrorMessage(null);
//         const res = await axios.get<Blog[]>(`${api}/api/blogs`, {
//           timeout: 10000,
//         });
//         setBlogs(res.data);
//       } catch (err) {
//         const error = err as AxiosError;
//         if (axios.isAxiosError(error)) {
//           if (error.response) {
//             setErrorMessage(
//               `Error ${error.response.status}: ${
//                 (error.response.data as { error?: string })?.error ||
//                 error.response.statusText
//               }`
//             );
//           } else if (error.request) {
//             setErrorMessage("No response from backend. It might be down.");
//           } else {
//             setErrorMessage(error.message);
//           }
//         } else {
//           setErrorMessage("Unexpected error occurred.");
//         }
//       }
//     };

//     fetchBlogs();
//   }, [api]);

//   // Handlers
//   const handleCreateBlog = async (title: string, content: string) => {
//     try {
//       setErrorMessage(null);
//       const res = await axios.post<Blog>(`${api}/api/blogs`, { title, content });
//       setBlogs((prev) => [...prev, res.data]);
//       setIsCreateModalOpen(false);
//     } catch (err) {
//       const error = err as AxiosError;
//       setErrorMessage((error.response?.data as { error?: string })?.error || "Error creating blog");
//     }
//   };

//   const handleDeleteBlog = async (id: string) => {
//     try {
//       setErrorMessage(null);
//       await axios.delete(`${api}/api/blogs/${id}`);
//       setBlogs((prev) => prev.filter((blog) => blog.id !== id));
//     } catch (err) {
//       const error = err as AxiosError;
//       setErrorMessage((error.response?.data as { error?: string })?.error || "Error deleting blog");
//     }
//   };

//   const handleEditBlog = async (id: string, title: string, content: string) => {
//     try {
//       setErrorMessage(null);
//       const res = await axios.put<Blog>(`${api}/api/blogs/${id}`, { title, content });
//       setBlogs((prev) => prev.map((blog) => (blog.id === id ? res.data : blog)));
//       setEditingBlog(null);
//     } catch (err) {
//       const error = err as AxiosError;
//       setErrorMessage((error.response?.data as { error?: string })?.error || "Error updating blog");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="w-full max-w-md">
//           {isLoginMode ? (
//             <LoginForm onToggleMode={() => setIsLoginMode(false)} />
//           ) : (
//             <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="font-sans px-20 min-h-screen">
//       <header className="flex justify-between items-center py-4">
//         <h1 className="text-3xl font-bold">My Blog App</h1>
//         <div className="flex items-center space-x-4">
//           <span className="text-gray-700">
//             Welcome, {user.username} ({user.role})
//           </span>
//           <button
//             onClick={logout}
//             className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="flex flex-col gap-8 items-center sm:items-start">
//         {user.role === "admin" && (
//           <button
//             onClick={() => setIsCreateModalOpen(true)}
//             className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//           >
//             Create New Blog
//           </button>
//         )}

//         {errorMessage && (
//           <div className="p-4 bg-red-100 text-red-700 rounded w-full max-w-3xl">
//             {errorMessage}
//           </div>
//         )}

//         {/* Create Modal */}
//         {isCreateModalOpen && (
//           <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//               <BlogForm
//                 onCreate={handleCreateBlog}
//                 onCancel={() => setIsCreateModalOpen(false)}
//               />
//             </div>
//           </div>
//         )}

//         {editingBlog && (
//           <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//               <BlogForm
//                 onCreate={(title, content) =>
//                   handleEditBlog(editingBlog.id, title, content)
//                 }
//                 onCancel={() => setEditingBlog(null)}
//                 initialTitle={editingBlog.title}
//                 initialContent={editingBlog.content}
//                 isEditing={true}
//               />
//             </div>
//           </div>
//         )}

//         <div className="mt-8 w-full max-w-3xl">
//           <BlogList
//             blogs={blogs}
//             onDelete={user.role === "admin" ? handleDeleteBlog : undefined}
//             onEdit={
//               user.role === "admin"
//                 ? (id, title, content) =>
//                     setEditingBlog({ id, title, content, author: user })
//                 : undefined
//             }
//           />
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import BlogForm from "../components/BlogForm";
import BlogList from "../components/BlogList";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

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

export default function Home() {
  const api = (process.env.NEXT_PUBLIC_API_URL || "")
  const joinUrl = (base: string, path: string) =>
  `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

  const { user, loading, logout } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Axios auth header setup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setErrorMessage(null);
const res = await axios.get<Blog[]>(joinUrl(api, "/api/blogs"), {
          timeout: 10000,
        });
        setBlogs(res.data);
      } catch (err) {
        const error = err as AxiosError;
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setErrorMessage(
              `Error ${error.response.status}: ${
                (error.response.data as { error?: string })?.error ||
                error.response.statusText
              }`
            );
          } else if (error.request) {
            setErrorMessage("No response from backend. It might be down.");
          } else {
            setErrorMessage(error.message);
          }
        } else {
          setErrorMessage("Unexpected error occurred.");
        }
      }
    };

    fetchBlogs();
  }, [api]);

  // Handlers
  const handleCreateBlog = async (title: string, content: string) => {
    try {
      setErrorMessage(null);
      const res = await axios.post<Blog>(joinUrl(api, "/api/blogs"), { title, content });

      setBlogs((prev) => [...prev, res.data]);
      setIsCreateModalOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      setErrorMessage((error.response?.data as { error?: string })?.error || "Error creating blog");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      setErrorMessage(null);
      await axios.delete(joinUrl(api, `/api/blogs/${id}`));
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } catch (err) {
      const error = err as AxiosError;
      setErrorMessage((error.response?.data as { error?: string })?.error || "Error deleting blog");
    }
  };

  const handleEditBlog = async (id: string, title: string, content: string) => {
    try {
      setErrorMessage(null);
const res = await axios.put<Blog>(joinUrl(api, `/api/blogs/${id}`), { title, content });
      setBlogs((prev) => prev.map((blog) => (blog.id === id ? res.data : blog)));
      setEditingBlog(null);
    } catch (err) {
      const error = err as AxiosError;
      setErrorMessage((error.response?.data as { error?: string })?.error || "Error updating blog");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md">
          {isLoginMode ? (
            <LoginForm onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans px-20 min-h-screen">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">My Blog App</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">
            Welcome, {user.username} ({user.role})
          </span>
          <button
            onClick={logout}
            className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-8 items-center sm:items-start">
        {user.role === "admin" && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create New Blog
          </button>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-100 text-red-700 rounded w-full max-w-3xl">
            {errorMessage}
          </div>
        )}

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <BlogForm
                onCreate={handleCreateBlog}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </div>
          </div>
        )}

        {editingBlog && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <BlogForm
                onCreate={(title, content) =>
                  handleEditBlog(editingBlog.id, title, content)
                }
                onCancel={() => setEditingBlog(null)}
                initialTitle={editingBlog.title}
                initialContent={editingBlog.content}
                isEditing={true}
              />
            </div>
          </div>
        )}

        <div className="mt-8 w-full max-w-3xl">
          <BlogList
            blogs={blogs}
            onDelete={user.role === "admin" ? handleDeleteBlog : undefined}
            onEdit={
              user.role === "admin"
                ? (id, title, content) =>
                    setEditingBlog({ id, title, content, author: user })
                : undefined
            }
          />
        </div>
      </main>
    </div>
  );
}
