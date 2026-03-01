"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { getErrorMessage } from "@/types/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await api.get("/users/me");
      setUser(data);
    } catch (error) {
      console.error("Failed to load user:", error);
      Cookies.remove("accessToken");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      Cookies.set("accessToken", response.data.tokens.accessToken);
      setUser(response.data.user);
    } catch (error) {
      throw getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", credentials);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("accessToken");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser: loadUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
