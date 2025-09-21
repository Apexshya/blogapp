// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import axios from 'axios';

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: 'user' | 'admin';
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string, role?: string) => Promise<void>;  
//   register: (username: string, email: string, password: string, role?: string) => Promise<void>;
//   logout: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkLoggedIn();
//   }, []);

//   const checkLoggedIn = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
//         setUser(response.data.data.user);
//       }
//     } catch (error) {
//       console.error('Error checking authentication:', error);
//       localStorage.removeItem('token');
//       delete axios.defaults.headers.common['Authorization'];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email: string, password: string, role?: string) => {
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
//         email,
//         password,
//         role, // send role to backend
//       });

//       const { token, data } = response.data;
//       localStorage.setItem('token', token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(data.user);
//     } catch (error) {
//   if (axios.isAxiosError(error)) {
//     throw new Error(error.response?.data?.error || 'Login failed');
//   }
//   throw new Error('Unexpected login error');
// }

//   };

//   const register = async (username: string, email: string, password: string, role?: string) => {
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
//         username,
//         email,
//         password,
//         role
//       });

//       const { token, data } = response.data;
//       localStorage.setItem('token', token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(data.user);
//     } catch (error) {
//   if (axios.isAxiosError(error)) {
//     throw new Error(error.response?.data?.error || 'Registration failed');
//   }
//   throw new Error('Unexpected registration error');
// }

//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<void>;  
  register: (username: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper to safely join base URL and path without double slashes
const joinUrl = (base: string, path: string) => 
  `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const api = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(joinUrl(api, "/api/auth/me"));
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role?: string) => {
    try {
      const response = await axios.post(joinUrl(api, "/api/auth/login"), {
        email,
        password,
        role, // send role to backend if any
      });

      const { token, data } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(data.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw new Error('Unexpected login error');
    }
  };

  const register = async (username: string, email: string, password: string, role?: string) => {
    try {
      const response = await axios.post(joinUrl(api, "/api/auth/register"), {
        username,
        email,
        password,
        role
      });

      const { token, data } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(data.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
      throw new Error('Unexpected registration error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
