"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type User = {
  id: string;
  displayName: string;
  uuid?: string;
  xuid?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function MicrosoftAuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for login success or error from redirect
  useEffect(() => {
    const loginSuccess = searchParams.get("login");
    const error = searchParams.get("error");
    
    if (loginSuccess === "success") {
      // Remove the query parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState({}, document.title, url.toString());
      
      // Reload user data
      checkAuth();
    } else if (error) {
      console.error("Login error:", error);
      // Remove the query parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, document.title, url.toString());
    } else {
      // Normal auth check on load
      checkAuth();
    }
  }, [searchParams]);

  // First check localStorage for a cached user to show immediately
  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem('mcsr_user');
      if (cachedUser) {
        const userData = JSON.parse(cachedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Failed to read cached user:", e);
    }
    
    // Then perform the actual validation
    checkAuth();
  }, []);

  useEffect(() => {
    // Check for authenticated header first (instant)
    const isAuthHeader = document.head.querySelector('meta[name="x-is-authenticated"]');
    if (isAuthHeader && isAuthHeader.getAttribute('content') === 'true') {
      setIsAuthenticated(true);
    }
    
    // Then validate properly
    checkAuth();
  }, []);

  // Check for authentication
  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Make a request to the server to check authentication status
      const response = await fetch("/api/auth/validate", {
        method: "GET",
        credentials: "include", // Important! This ensures cookies are sent
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Cache the user data
        localStorage.setItem('mcsr_user', JSON.stringify(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('mcsr_user');
      }
    } catch (error) {
      console.error("Auth validation error:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('mcsr_user');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/callback`;
    const scope = "XboxLive.signin offline_access";
    const responseType = "code";

    const authUrl = `https://login.live.com/oauth20_authorize.srf?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Important for cookies
      });
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('mcsr_user');
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within a MicrosoftAuthProvider");
  }
  
  return context;
};