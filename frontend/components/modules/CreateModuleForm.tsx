"use client";

import { createModule } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useState, SubmitEvent } from "react";

export default function CreateModuleForm() {
  const router = useRouter();
  const params = useParams<{ courseId : string }>();
  const courseId = params.courseId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Module title is required.");
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 1) {
      setError("Display order must be a positive whole number.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await createModule(courseId, {
        title: title.trim(),
        description: description.trim() || ""
      });

      setTitle("");
      setDescription("");
      setSuccess("Module created successfully.");
      router.back();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create module."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Add a module</h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium"
          >
            Module title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="e.g. Introduction to Programming"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium"
          >
            Description
            <span className="ml-1 font-normal text-gray-400">
              (optional)
            </span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="What will students learn in this module?"
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="max-w-xs">
          <label
            htmlFor="displayOrder"
            className="mb-1.5 block text-sm font-medium"
          >
            Display order
          </label>
          <input
            id="displayOrder"
            type="number"
            min={1}
            step={1}
            required
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Lower numbers appear first.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create module"}
        </button>
      </form>
    </section>
  )
}