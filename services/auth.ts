import { User } from '../types';

const API_URL = 'http://localhost:8080/api/auth';
const SESSION_KEY = 'lumina_session';
const TOKEN_KEY = 'lumina_token';

// Helper to save session
const saveSession = (user: User, token: string) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export const checkSession = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        resolve(JSON.parse(session));
      } else {
        resolve(null);
      }
    } catch (e) {
      resolve(null);
    }
  });
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
       // If backend is not running, throw error or fallback
       throw new Error('Login failed');
    }

    const data = await response.json();
    saveSession(data.user, data.token);
    return data.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error("Invalid credentials or server unavailable");
  }
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
       const errData = await response.json().catch(() => ({}));
       throw new Error(errData.message || 'Registration failed');
    }

    const data = await response.json();
    saveSession(data.user, data.token);
    return data.user;
  } catch (error: any) {
    throw new Error(error.message || "Registration failed");
  }
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setTimeout(() => {
      resolve();
    }, 500);
  });
};
