import { useState } from "react";

interface BlogFormProps {
  onCreate: (title: string, content: string) => void;
  onCancel?: () => void;
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({ 
  onCreate, 
  onCancel, 
  initialTitle = "", 
  initialContent = "", 
  isEditing = false 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onCreate(title, content);
      setTitle(""); 
      setContent(""); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {isEditing ? "Edit Blog" : "Create a New Blog"}
      </h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog Title"
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Blog Content"
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
      />
      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {isEditing ? "Update Blog" : "Create Blog"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BlogForm;