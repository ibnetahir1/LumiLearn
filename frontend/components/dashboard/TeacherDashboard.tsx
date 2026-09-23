"use client";

import { getCourses } from "@/lib/api";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import CourseCard from "../courses/CourseCard";
import { getAccessToken } from "@/lib/auth";
import Link from "next/link";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      const token = getAccessToken();

      try {
        const options = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const data = await getCourses(options);
        setCourses(data);
      } catch {
        setError("Unable to load your courses.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Teacher Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Your Courses
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your courses and track student learning.
          </p>
        </div>

        <Link
          href="/teacher/courses/new"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Create Course
        </Link>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">Loading courses...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No courses yet
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Create your first course to start building your learning portal.
          </p>
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} url="teacher" />
          ))}
        </div>
      )}
    </div>
  );
}