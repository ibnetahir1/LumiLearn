"use client";

import Link from "next/link";
import CourseModules from "@/components/modules/CourseModules";

export default function ModulesPage() {

  return (
    <main className="mx-auto max-w-5xl min-w-full sm:min-w-2/3 lg:min-w-1/2 space-y-8 p-6">
      <div className="flex justify-between items-center">
        <Link
          href="./"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Course Overview
        </Link>

        <div>
          <Link
            href="./modules/new"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Create Module
          </Link>
        </div>
      </div>
      

      <CourseModules />
    </main>
  );
}
