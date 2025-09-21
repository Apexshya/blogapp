import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unknown error occurred.");
  }
}

  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Login
      </button>
      <p className="mt-4 text-center">
  Don&apos;t have an account?{" "}       
   <button
          type="button"
          onClick={onToggleMode}
          className="text-blue-600 hover:underline"
        >
          Register
        </button>
      </p>
    </form>
  );
};

export default LoginForm;




