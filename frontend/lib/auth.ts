'use client';

import { redirect } from "next/navigation";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
}

export function clearAccessToken() {
  localStorage.removeItem("accessToken");
}

export async function requireRole(role: "Teacher" | "Student") {
  const token = getAccessToken();

  if (!token) {
    redirect("/login");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    redirect("/login");
  }

  const user = await response.json();

  if (user.roles[0] !== role) {
    redirect("/dashboard");
  }

  return user;
}