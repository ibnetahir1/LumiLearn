"use client";

import CourseCard from "@/components/courses/CourseCard";
import { getAvailableCourses } from "@/lib/api";
import { Course } from "@/types/course";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // TODO: cache courses so we can use it between components instead of 
    // making too many api call?
    async function loadCourses() {
      try {
        
        const courses = await getAvailableCourses();
        setCourses(courses);
      } catch {
        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Find Courses
          </h1>

          <p className="mt-2 text-gray-600">
            Browse courses and enroll in a class.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-gray-600">Loading courses...</p>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              No courses available
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              There are currently no courses available to enroll in.
            </p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} url="student" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}