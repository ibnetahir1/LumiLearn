"use client";

import { getCourse } from "@/lib/api";
import { Course } from "@/types/course";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentCourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const course = await getCourse(courseId);
        setCourse(course);
      } catch (err) {
        console.error(err);
        setError("Unable to load this course.");
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-gray-600">Loading course...</p>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">
            {error ?? "Course not found."}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to courses
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to available courses
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          {course.subject}
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {course.name}
        </h1>

        <p className="mt-4 text-gray-600">
          {course.description}
        </p>
      </div>
    </main>
  );
}