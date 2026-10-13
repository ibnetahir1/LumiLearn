"use client";

import CourseModules from "@/components/modules/CourseModules";
import { getCourse } from "@/lib/api";
import { Course } from "@/types/course";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherCourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const course = await getCourse(courseId);
        setCourse(course);
      } catch {
        setError("Unable to load this course.");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
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
            {error}
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
          ← Back to courses
        </Link>
      </div>

      <div className="mt-6 max-w-3xl">
        <div>
          <p className="text-sm font-medium text-blue-600">
            {course.subject}
          </p>

          <h1 className="mt-1 text-3xl font-bold">{course.name}</h1>
        </div>

        <p className="mt-6 text-gray-700">
          {course.description || "No course description provided."}
        </p>

        <section className="mt-8">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Course Content</h2>
              <p className="mt-1 text-sm text-gray-500">
                Explore the modules in this course.
              </p>
            </div>
            
            <div>
              <Link
                href={`./${courseId}/modules`}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                All Modules
              </Link>
            </div>
          </div>

          <CourseModules />
        </section>
      </div>
    </main>
  );
}