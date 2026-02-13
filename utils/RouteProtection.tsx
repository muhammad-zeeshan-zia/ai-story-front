"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import React, { ReactNode, useEffect } from "react";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isUser = localStorage.getItem("user");
    if (!loading) {
      if (!authenticated) {
        router.push("/login");
      } else if (!isUser) {
        router.push("/admin/");
      }
    }
  }, [loading, authenticated, router]);

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return null;

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated) {
      router.push("/landing-page");
    }
  }, [loading, authenticated, router]);

  if (loading) return <div>Loading...</div>;
  if (authenticated) return null;

  return <>{children}</>;
}

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!loading) {
      if (!authenticated) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/landing-page");
      }
    }
  }, [loading, router]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}

export function ProtectedUserRoute({ children }: { children: ReactNode }) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isUser = localStorage.getItem("user");
    const user = isUser ? JSON.parse(isUser) : null;
    if (!loading) {
      if (!authenticated) {
        router.push("/login");
      } else if (!isUser) {
        router.push("/admin/");
      } else if (user.public === true) {
        router.push("/landing-page");
        return;
      }
    }
  }, [loading, router]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
