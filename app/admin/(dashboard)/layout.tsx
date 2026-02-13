"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/components/AdminSidebar";
import { ProtectedAdminRoute } from "@/utils/RouteProtection";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-50">
      <Sidebar expanded={expanded} onToggle={() => setExpanded(!expanded)} />

      <div
        className={`flex flex-1 transition-all duration-300 ${
          isMobile 
            ? 'ml-16'
            : expanded 
              ? "ml-56" 
              : "ml-16"
        }`}
        style={{ minWidth: 0 }}
      >
        <ProtectedAdminRoute>
          {children}
        </ProtectedAdminRoute>
      </div>
    </div>
  );
}