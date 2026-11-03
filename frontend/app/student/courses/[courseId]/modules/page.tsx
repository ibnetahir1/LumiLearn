"use client";

import Link from "next/link";
import CourseModules from "@/components/modules/CourseModules";

export default function ModulesPage() {

  return (
    <main className="mx-auto max-w-5xl min-w-full sm:min-w-2/3 lg:min-w-1/2 space-y-8 p-6">
      <Link
        href="./"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Course Overview
      </Link>

      <CourseModules role="Student" />
    </main>
  );
}
