import { Course } from "@/types/course";
import { EnrollmentResponse } from "@/types/enrollment-response";
import { getAccessToken } from "./auth";
import { CreateModuleRequest, Module } from "@/types/module";
import { RegisterRequest } from "@/types/register-request";
import { Topic } from "@/types/topic";

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

function getHeaders(method?: string, body?: BodyInit, getToken: boolean = true): RequestInit {
  const token = getToken ? getAccessToken() : null;
  const options = {
    method: method,
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: body
  };

  return options;
}

export async function register(request: RegisterRequest): Promise<Response> {
  const options = getHeaders("POST", JSON.stringify(request), false);
  return apiRequest("/api/auth/register", options);
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
  let options = getHeaders("POST");
  return apiRequest<EnrollmentResponse>(`/api/courses/${courseId}/enroll`, options);
}

export async function getCourseModules(courseId: string): Promise<Module[]> {
  const options = getHeaders();

  return apiRequest<Module[]>(`/api/courses/${courseId}/modules`, options);
}

export async function createModule(courseId: string, request: CreateModuleRequest): Promise<Module[]> {
  const options = getHeaders("POST", JSON.stringify(request));

  return apiRequest<Module[]>(`/api/courses/${courseId}/modules`, options);
}

export async function getTopics(moduleId: number): Promise<Topic[]> {
  const options = getHeaders();
  return apiRequest<Topic[]>(`/api/modules/${moduleId}/topics`, options);
}

export async function createTopic(moduleId: number, name: string): Promise<Topic> {
  const options = getHeaders("POST", JSON.stringify({ name }));
  return apiRequest<Topic>(`/api/modules/${moduleId}/topics`, options);
}