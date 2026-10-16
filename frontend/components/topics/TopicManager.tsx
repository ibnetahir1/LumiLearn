"use client";

import { useEffect, useState, SubmitEvent } from "react";
import { createTopic, getTopics } from "@/lib/api";
import { Topic } from "@/types/topic";

interface TopicManagerProps {
  moduleId: number;
  role: string;
}

const sampleMaterials: Record<string, string[]> = {
  "Get Started": [
    "9.1 | What am I learning & doing today?",
    "9.1 | Warm up your brain!",
  ],
  "Consider This!": [
    "9.1 | Read: Who was George Washington Carver?",
    "9.1 | Watch: GWC makes his mark!",
  ],
  "Respond & Reflect": [
    "9.1 | Check Your Understanding",
    "9.1 | Padlet: KWL on GWC!",
  ],
  "Wrapping Up": [
    "9.1 | Wrap-up & Closure",
    "9.1 | Exit Ticket: Connect, Extend, Challenge",
  ],
};

export default function TopicManager({ moduleId, role }: TopicManagerProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<number[]>([]);

  async function loadTopics() {
    setLoading(true);
    setError("");

    try {
      const result = await getTopics(moduleId);
      setTopics(result);
    } catch {
      setError("Unable to load topics. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTopics();
  }, [moduleId]);

  async function handleCreateTopic( event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || saving) return;

    setSaving(true);
    setError("");

    try {
      const created = await createTopic(moduleId, trimmedName);
      setTopics((current) => [...current, created]);
      setName("");
    } catch {
      setError("Unable to create topic. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function toggleTopic(topicId: number) {
    setExpandedTopics((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId]
    );
  }

  if (loading) {
    return (
      <p className="py-4 text-sm text-gray-500">
        Loading topics...
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {role === "Teacher" && (
        <form
          onSubmit={handleCreateTopic}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter a topic name"
            maxLength={200}
            required
            aria-label="New topic name"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add topic"}
          </button>
        </form>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
          <button
            type="button"
            onClick={() => void loadTopics()}
            className="ml-2 font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && topics.length === 0 && !error && (
        <p className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
          No topics yet. Add the first topic for this module.
        </p>
      )}

      <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200">
        {topics.map((topic) => {
          const expanded = expandedTopics.includes(topic.id);
          const materials = sampleMaterials[topic.name] ?? [];

          return (
            <div key={topic.id} className="bg-white">
              <button
                type="button"
                onClick={() => toggleTopic(topic.id)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
              >
                <span className="text-gray-400" aria-hidden="true">
                  {expanded ? "⌄" : "›"}
                </span>

                <span className="min-w-0 flex-1 text-sm font-medium text-gray-900">
                  {topic.name}
                </span>

                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                  {materials.length} sample materials
                </span>
              </button>

              {expanded && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {materials.length > 0 ? (
                    materials.map((material) => (
                      <div
                        key={material}
                        className="flex items-center gap-3 border-b border-gray-100 px-5 py-3 last:border-b-0"
                      >
                        <span
                          className="text-gray-400"
                          aria-hidden="true"
                        >
                          ▤
                        </span>
                        <span className="flex-1 text-sm text-gray-700">
                          {material}
                        </span>
                        <span
                          title="Sample material; not yet saved"
                          className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800"
                        >
                          Demo
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="px-5 py-4 text-sm text-gray-500">
                      No sample materials for this topic. Real
                      materials will appear here when material
                      management is implemented.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        Sample materials are for layout preview only. They are not
        stored in the database.
      </p>
    </div>
  );
}
