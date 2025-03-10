import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: number;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  message: string;
  user: User & {
    roles: Array<{
      id: number;
      name: string;
      permissions: Array<{
        id: number;
        name: string;
      }>;
    }>;
  };
  roles: string[];
  permissions: string[];
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  roles: string[];
  permissions: string[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    const storedRoles = localStorage.getItem('auth_roles');
    const storedPermissions = localStorage.getItem('auth_permissions');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRoles(storedRoles ? JSON.parse(storedRoles) : []);
      setPermissions(storedPermissions ? JSON.parse(storedPermissions) : []);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: LoginResponse = await response.json();
      
      // Extract only the necessary user data without roles
      const { roles: userRoles, permissions: userPermissions, token: userToken, user: userData } = data;
      
      // Create a clean user object without the roles property
      const cleanUser: User = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        role_id: userData.role_id,
        email_verified_at: userData.email_verified_at,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      };

      // Store auth data
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('auth_user', JSON.stringify(cleanUser));
      localStorage.setItem('auth_roles', JSON.stringify(userRoles));
      localStorage.setItem('auth_permissions', JSON.stringify(userPermissions));
      
      setToken(userToken);
      setUser(cleanUser);
      setRoles(userRoles);
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Logout API call failed');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_roles');
      localStorage.removeItem('auth_permissions');
      setToken(null);
      setUser(null);
      setRoles([]);
      setPermissions([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        roles,
        permissions,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 