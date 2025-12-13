import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("tasty_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("tasty_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tasty_user");
    }
  }, [user]);

  async function login(email, geslo) {
    const u = await loginUser({ email, geslo });
    setUser(u);
    return u;
  }

  async function register(ime, email, geslo) {
    const u = await registerUser({ ime, email, geslo });
    setUser(u);
    return u;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
