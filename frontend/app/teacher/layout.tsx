'use client';

import { requireRole } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function TeacherLayout({ children }: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      await requireRole("Teacher");
      setLoading(false);
    }

    checkRole();
  }, []);
    
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-300">
      </main>
    )
  }

  return <>{children}</>;
}