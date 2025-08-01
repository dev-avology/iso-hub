import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, LogIn } from 'lucide-react';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [autoLoginInProgress, setAutoLoginInProgress] = useState(false);

  // Check if accessed via iframe and redirect immediately
  useEffect(() => {
    const checkIframeAndRedirect = () => {
      // Check if we're in an iframe (accessed via ISO-Hub)
      const isInIframe = window.self !== window.top;
      
      if (isInIframe) {
        console.log('JACC accessed via iframe - redirecting to home...');
        // If accessed via iframe, redirect to home immediately
        window.location.href = '/';
        return;
      }
    };

    // Check for existing session first
    const checkExistingSession = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          console.log('User already authenticated, redirecting to home...');
          window.location.href = '/';
          return;
        }
      } catch (error) {
        console.log('Session check failed, continuing with login flow');
      }
      
      // If no session, check iframe and redirect if needed
      checkIframeAndRedirect();
    };

    // Reduced delay for faster loading
    const timer = setTimeout(checkExistingSession, 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-login functionality for URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const password = urlParams.get('password');
    
    if (username && password) {
      setAutoLoginInProgress(true);
      setIsLoading(true);
      
      // Auto-login with URL parameters
      const performAutoLogin = async () => {
        try {
          // Clear any existing session cookies before login
          document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          
          console.log('Auto-login attempt for:', username);

          // Use the correct login endpoint
          const loginUrl = `${import.meta.env.VITE_API_URL || ''}/api/auth/simple-login`;
          
          console.log(`Trying auto-login at ${loginUrl}...`);
          const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
          });

          console.log(`Auto-login response status:`, response.status);

          if (response.ok) {
            const loginData = await response.json();
            console.log('Auto-login successful, user data:', loginData);
            
            // Reduced delay for faster loading
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Clear query cache before redirect
            queryClient.clear();
            
            // Force page refresh to ensure cookie sync
            window.location.href = '/';
          } else {
            console.error('Auto-login failed');
            setAutoLoginInProgress(false);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
          setAutoLoginInProgress(false);
          setIsLoading(false);
        }
      };
      
      performAutoLogin();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clear any existing session cookies before login
      document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      const formData = new FormData(e.target as HTMLFormElement);
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;

      console.log('Attempting login for:', username);

      // Use the correct login endpoint
      const loginUrl = `${import.meta.env.VITE_API_URL || ''}/api/auth/simple-login`;
      
      console.log(`Trying login at ${loginUrl}...`);
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      console.log(`Login response status:`, response.status);

      if (response.ok) {
        const loginData = await response.json();
        console.log('Login successful, user data:', loginData);
        
        // Reduced delay for faster loading
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Clear query cache before redirect
        queryClient.clear();
        
        // Force page refresh to ensure cookie sync
        window.location.href = '/';
      } else {
        alert('Login failed - please check your credentials and try again');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner if auto-login is in progress
  if (autoLoginInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Logging you in...</CardTitle>
            <CardDescription>
              Please wait while we authenticate your credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Authenticating...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to JACC</CardTitle>
          <CardDescription>
            AI-Powered Merchant Services Assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                defaultValue="cburnell"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                defaultValue="cburnell123"
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          

        </CardContent>
      </Card>
    </div>
  );
}