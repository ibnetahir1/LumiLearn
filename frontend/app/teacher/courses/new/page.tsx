import CreateCourseForm from "@/components/courses/CreateCourseForm";

export default function NewCoursePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Course Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Create Course
          </h1>

          <p className="mt-2 text-gray-600">
            Set up the basic information for your new course.
          </p>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <CreateCourseForm />
          </div>
        </div>
      </div>
    </main>
  );
}