import { Course } from "@/types/course";
import { EnrollmentResponse } from "@/types/enrollment-response";
import { getAccessToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

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

function getHeaders(): RequestInit {
  const token = getAccessToken();
  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  return options;
}

export async function getCourses(options: RequestInit): Promise<Course[]> {
  return apiRequest<Course[]>("/api/courses", options);
}

export async function getCourse(courseId: string): Promise<Course> {
  const options = getHeaders();
  return apiRequest<Course>(`/api/courses/${courseId}`, options);
}

export async function getAvailableCourses(options: RequestInit): Promise<Course[]> {
  return apiRequest<Course[]>("/api/courses/available", options);
}

export async function enrollStudent(courseId: string, options: RequestInit){
  return apiRequest<EnrollmentResponse>(`/api/courses/${courseId}/enroll`, options);
}