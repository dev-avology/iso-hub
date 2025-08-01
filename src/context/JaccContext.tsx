import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';

interface JaccContextType {
  isJaccInitialized: boolean;
  jaccUrl: string;
  setJaccInitialized: (initialized: boolean) => void;
  initializeJacc: () => Promise<void>;
}

const JaccContext = createContext<JaccContextType | undefined>(undefined);

export const useJacc = () => {
  const context = useContext(JaccContext);
  if (!context) {
    throw new Error('useJacc must be used within a JaccProvider');
  }
  return context;
};

interface JaccProviderProps {
  children: React.ReactNode;
}

export const JaccProvider: React.FC<JaccProviderProps> = ({ children }) => {
  const [isJaccInitialized, setIsJaccInitialized] = useState(false);
  const [jaccUrl, setJaccUrl] = useState('');
  const { user } = useAuth();

  const initializeJacc = async () => {
    if (isJaccInitialized && jaccUrl) {
      console.log('JACC already initialized with URL:', jaccUrl);
      return; // Already initialized
    }

    try {
      console.log('Starting JACC initialization...');
      
      // Get user credentials from localStorage
      const userData = localStorage.getItem('auth_user');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user || !user.email) {
        console.log('User not authenticated for JACC');
        return;
      }

      console.log('User authenticated, checking JACC session...');

      // Check if JACC session exists
      const jaccSession = localStorage.getItem('jacc_session');
      if (!jaccSession) {
        console.log('No JACC session found, attempting auto-login...');
        // Try to auto-login to JACC
        try {
          const jaccLoginUrl = `${import.meta.env.VITE_JACC_URL || 'http://localhost:5000'}/api/auth/simple-login`;
          console.log('Attempting JACC login at:', jaccLoginUrl);
          
          const response = await fetch(jaccLoginUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              username: user.email || user.username, 
              password: user.password || 'default_password' 
            }),
            credentials: 'include'
          });

          if (response.ok) {
            const loginData = await response.json();
            localStorage.setItem('jacc_session', JSON.stringify(loginData));
            console.log('JACC auto-login successful');
          } else {
            console.warn('JACC auto-login failed');
          }
        } catch (error) {
          console.error('JACC auto-login error:', error);
        }
      } else {
        console.log('JACC session already exists');
      }

      // Set JACC URL
      const url = `${import.meta.env.VITE_JACC_URL || 'http://localhost:5000'}/`;
      console.log('Setting JACC URL to:', url);
      setJaccUrl(url);
      setIsJaccInitialized(true);
      console.log('JACC initialized successfully');
    } catch (error) {
      console.error('Failed to initialize JACC:', error);
    }
  };

  const setJaccInitialized = (initialized: boolean) => {
    setIsJaccInitialized(initialized);
  };

  // Initialize JACC when user is available
  useEffect(() => {
    if (user && !isJaccInitialized) {
      initializeJacc();
    }
  }, [user, isJaccInitialized]);

  // Listen for JACC initialization events
  useEffect(() => {
    const handleJaccInitialize = () => {
      console.log('JACC initialization event received');
      if (user && !isJaccInitialized) {
        initializeJacc();
      }
    };

    window.addEventListener('jacc-initialize', handleJaccInitialize);
    
    return () => {
      window.removeEventListener('jacc-initialize', handleJaccInitialize);
    };
  }, [user, isJaccInitialized, initializeJacc]);

  const value: JaccContextType = {
    isJaccInitialized,
    jaccUrl,
    setJaccInitialized,
    initializeJacc
  };

  return (
    <JaccContext.Provider value={value}>
      {children}
    </JaccContext.Provider>
  );
}; 