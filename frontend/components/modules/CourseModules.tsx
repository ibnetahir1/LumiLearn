"use client";

import { getCourseModules } from "@/lib/api";
import type { Module } from "@/types/module";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CourseModules() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [modules, setModules] = useState<Module[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadModules() {
      try {
        const modules = await getCourseModules(courseId);
        setModules(modules);
      } catch {
        setError("Unable to load Modules.");
      } finally {
        setLoading(false);
      }
    }

    loadModules();
  }, [courseId]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading modules...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">
          {error}
        </p>
      </div>
    )
  }

  return (
    <>
      {modules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <h3 className="font-medium">No course content yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no modules added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((module) => (
            <article
              key={module.id}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-200"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-700">
                {module.displayOrder}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {module.title}
                </h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                  {module.description ||
                    "No description provided."}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
