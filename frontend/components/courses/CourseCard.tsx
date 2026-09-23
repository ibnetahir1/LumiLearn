import { Course } from "@/types/course";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
  url: string
}

export default function CourseCard({ course, url }: CourseCardProps) {
  return (
    <Link
      href = {`/${url}/courses/${course.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3">
        <span className="text-sm font-medium text-blue-600">
          {course.subject}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900">
        {course.name}
      </h2>

      {course.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {course.description}
        </p>
      )}
    </Link>
  )
}