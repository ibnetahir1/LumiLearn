'use client';

import { requireRole } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function StudentLayout({ children }: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function checkRole() {
        await requireRole("Student");
        setLoading(false);
      }
  
      checkRole();
    }, []);
      
    if (loading) {
      return (
        <main className="min-h-screen bg-gray-100">
        </main>
      )
    }

  return <>{children}</>;
}