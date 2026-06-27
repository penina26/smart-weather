import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const USER_KEY = "atmosphere_user";
const ACCESS_TOKEN_KEY = "atmosphere_access_token";
const REFRESH_TOKEN_KEY = "atmosphere_refresh_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
  });

  const login = (userData, tokens = {}) => {
    const access = tokens.accessToken || tokens.access_token;
    const refresh = tokens.refreshToken || tokens.refresh_token;

    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    if (access) {
      setAccessToken(access);
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
    }

    if (refresh) {
      setRefreshToken(refresh);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token: accessToken,
      accessToken,
      refreshToken,
      isAuthenticated: !!user && !!accessToken,
      login,
      logout,
    }),
    [user, accessToken, refreshToken]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}