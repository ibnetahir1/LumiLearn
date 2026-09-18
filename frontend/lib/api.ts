import { Course } from "@/types/course";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7244";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const errorBody = await response.json();

      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // Response did not contain JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getCourses(options: RequestInit): Promise<Course[]> {
  return apiRequest<Course[]>("/api/courses", options);
}