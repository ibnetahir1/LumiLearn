"use client";

import ModuleCard from "@/components/modules/ModuleCard";
import { getCourse, getCourseModules } from "@/lib/api";
import { Course } from "@/types/course";
import { Module } from "@/types/module";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherCourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const course = await getCourse(courseId);
        setCourse(course);
        loadModules();
      } catch {
        setError("Unable to load this course.");
      } finally {
        setLoading(false);
      }
    }

    async function loadModules() {
      try {
        const modules = await getCourseModules(courseId);
        setModules(modules);
      } catch {
        setError("Unable to load Modules.");
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

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Course Content</h2>

          {!loading && !error && modules.length === 0 && (
            <div className="mt-4 rounded-lg border p-6 text-gray-600">
              This course does not contain any modules.
            </div>
          )}

          {!loading && !error && modules.length > 0 && (
            <div className="">
              {modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          )}
          
        </section>
      </div>
    </main>
  );
}