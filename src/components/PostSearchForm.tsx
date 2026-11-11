import Form from "next/form";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { MAX_QUERY_LENGTH } from "@/lib/search-query";

interface PostSearchFormProps {
  q: string;
  topic: string;
  topics: string[];
}

/**
 * GET search form. next/form navigates client-side when JavaScript is available and
 * falls back to a normal page load without it, so search always works and every
 * result page has a shareable URL (/dashboard?q=…&topic=…).
 */
export default function PostSearchForm({ q, topic, topics }: PostSearchFormProps) {
  const options = topic && !topics.includes(topic) ? [topic, ...topics] : topics;
  return (
    <Form
      action="/dashboard"
      role="search"
      aria-label="Search questions"
      // Remount when the URL changes so the fields show the current search.
      key={`${q}|${topic}`}
      className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/10 md:flex-row md:items-end"
    >
      <div className="flex-1">
        <label htmlFor="search-q" className="mb-1 text-base font-medium text-gray-900">
          Search title or content
        </label>
        <div className="relative">
          <FiSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" aria-hidden />
          <input
            id="search-q"
            type="search"
            name="q"
            defaultValue={q}
            maxLength={MAX_QUERY_LENGTH}
            placeholder="e.g. compost, maize, clay soil"
            autoComplete="off"
            enterKeyHint="search"
            className="form-field pl-9"
          />
        </div>
      </div>
      <div className="md:w-64">
        <label htmlFor="search-topic" className="mb-1 text-base font-medium text-gray-900">
          Topic
        </label>
        <select id="search-topic" name="topic" defaultValue={topic} className="form-field">
          <option value="">All topics</option>
          {options.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary min-h-11 px-4">
          <FiSearch aria-hidden /> Search
        </button>
        {(q || topic) && (
          <Link href="/dashboard" className="btn min-h-11 border-gray-300 px-4 text-gray-900 hover:bg-gray-100">
            <FiX aria-hidden /> Clear<span className="sr-only"> search</span>
          </Link>
        )}
      </div>
    </Form>
  );
}
