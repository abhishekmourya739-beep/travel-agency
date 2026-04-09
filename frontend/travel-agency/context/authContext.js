"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/api/auth";
import { getToken, removeToken, setToken } from "@/utils/token";
import { removeAuthCookie, setAuthCookie } from "@/utils/authCookies";
import {
  getStoredUser,
  removeStoredUser,
  setStoredUser,
} from "@/utils/userStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const refreshUser = async () => {
    try {
      const token = getToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await getUser();
      const currentUser = res?.data || res?.user || res || null;

      if (currentUser) {
        setUser(currentUser);
        setStoredUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      removeToken();
      removeAuthCookie();
      removeStoredUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ token, refreshToken, user }) => {
    if (token) {
      setToken(token);
      setAuthCookie(token);
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      await refreshUser();
    }
  };

  const logout = () => {
    removeToken();
    removeAuthCookie();
    removeStoredUser();
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  useEffect(() => {
    const localUser = getStoredUser();

    if (localUser) {
      setUser(localUser);
    }

    refreshUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
