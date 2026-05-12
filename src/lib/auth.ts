import { useEffect, useState } from "react";

const KEY = "pcba_auth";
const EVT = "pcba_auth_change";

export type AuthUser = { username: string };

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function login(username: string) {
  localStorage.setItem(KEY, JSON.stringify({ username }));
  window.dispatchEvent(new Event(EVT));
}

export function logout() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}

export function useAuth(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getAuth());
    const handler = () => setUser(getAuth());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return user;
}