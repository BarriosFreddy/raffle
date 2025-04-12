import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { notify } from '../services/notifications';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = 'raffle_auth_token';

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    role: string;
  };
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      // TODO: Optionally validate token with backend
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/api/auth/login`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token, user } = response.data;
      
      // Set token in localStorage and axios defaults
      localStorage.setItem(TOKEN_KEY, token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setIsAuthenticated(true);
      setUser(user);
      notify.success('Login successful');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Authentication failed';
        throw new Error(message);
      }
      throw new Error('Authentication failed');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    notify.info('Logged out successfully');
  }, []);

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};
