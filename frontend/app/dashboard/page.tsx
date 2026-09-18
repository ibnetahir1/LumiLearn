"use client";

import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import { apiRequest } from "@/lib/api";
import { clearAccessToken, getAccessToken } from "@/lib/auth";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getAccessToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await apiRequest<User>("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(currentUser);
        console.log(currentUser);
      } catch {
        clearAccessToken();
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading dashboard</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {user.roles[0] == "Teacher" && <TeacherDashboard />}

        {user.roles[0] == "Student" && <StudentDashboard />}

        {user.roles[0] !== "Teacher" && user.roles[0] !== "Student" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">
              Your account does not have a supported portal role.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}