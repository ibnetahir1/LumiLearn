import { Course } from "@/types/course";
import { EnrollmentResponse } from "@/types/enrollment-response";
import { getAccessToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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

    throw new ApiError(response.status, message);
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

export async function getCourses(): Promise<Course[]> {
  const options = getHeaders();
  return apiRequest<Course[]>("/api/courses", options);
}

export async function getCourse(courseId: string): Promise<Course> {
  const options = getHeaders();
  return apiRequest<Course>(`/api/courses/${courseId}`, options);
}

export async function getAvailableCourses(): Promise<Course[]> {
  const options = getHeaders();
  return apiRequest<Course[]>("/api/courses/available", options);
}

export async function enrollStudent(courseId: string){
  let options = getHeaders();
  options = {
    method: "POST",
    ...options
  }
  return apiRequest<EnrollmentResponse>(`/api/courses/${courseId}/enroll`, options);
}