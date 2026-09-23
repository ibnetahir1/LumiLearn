"use client";

import { ApiError, enrollStudent, getAvailableCourses, getCourse } from "@/lib/api";
import { Course } from "@/types/course";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentCourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        try {
          // If this succeeds, the student is already enrolled.
          const enrolledCourse = await getCourse(courseId);
          setCourse(enrolledCourse);
          setIsEnrolled(true);
          setIsAvailable(false);
          return;
        } catch (err) {
          // A 404 from the authorized course endpoint means
          // the student cannot access it as an enrolled student.
          if (!(err instanceof ApiError) || err.status !== 404) {
            throw err;
          }
        }
        
        // Check whether the course is available for enrollment.
        const availableCourses = await getAvailableCourses();

        const availableCourse = availableCourses.find(
          (course) => course.id === courseId
        );

        if (!availableCourse) {
          setCourse(null);
          setError("Course not found.");
          return;
        }

        setCourse(availableCourse);
        setIsEnrolled(false);
        setIsAvailable(true);
      } catch (err) {
        console.error(err);
        setError("Unable to load this course.");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  async function handleEnroll() {
    try {
      setEnrolling(true);
      setError("");

      await enrollStudent(courseId);

      // Enrollment succeeded, so the course is now accessible
      // through the authorise course endpoint.
      const enrolledCourse = await getCourse(courseId);

      setCourse(enrolledCourse);
      setIsEnrolled(true);
      setIsAvailable(false);
    } catch (err) {
      console.error(err);
      setError("Failed to enroll in course.")
    } finally {
      setEnrolling(false);
    }
  }

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
          ← Back to available courses
        </Link>
      </div>

      <div className="mt-6 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {course.subject}
            </p>

            <h1 className="mt-1 text-3xl font-bold">{course.name}</h1>
          </div>

          {isEnrolled && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              Enrolled
            </span>
          )}
        </div>

        <p className="mt-6 text-gray-700">
          {course.description || "No course description provided."}
        </p>

        {isAvailable && !isEnrolled && (
          <div className="mt-8 rounded-lg border bg-gray-50 p-6">
            <h2 className="text-lg font-semibold">
              Ready to start this course?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Enroll in this course to access its learning materials and assessments.
            </p>

            <button
              type="button"
              onClick={handleEnroll}
              disabled={enrolling}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enrolling ? "Enrolling..." : "Enroll in Course"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isEnrolled && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">Course Content</h2>

            <div className="mt-4 rounded-lg border p-6 text-gray-600">
              Modules and learning materials will appear here.
            </div>
          </section>
        )}
      </div>
    </main>
  );
}