"use client";

import { apiRequest } from "@/lib/api";
import { clearAccessToken, getAccessToken } from "@/lib/auth";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const token = getAccessToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const currentUser = await apiRequest<User>("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(currentUser);
      } catch {
        clearAccessToken();
        window.location.href = "/login";
      }
    }

    loadUser();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  function handleLogout() {
    clearAccessToken();
    window.location.href = "/login";
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome To LumiLearn
      </h1>

      <p className="mt-4">
        Signed in as: {user.email}
      </p>

      <p className="mt-2">
        Role: {user.roles.join(", ")}
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 rounded-md bg-black px-4 py-2 text-white"
      >
        Log out
      </button>
    </main>
  )
}