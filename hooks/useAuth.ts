"use client";
import { useEffect, useState } from "react";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setLoading(false);
  }, []);

  return { authenticated, loading };
}
