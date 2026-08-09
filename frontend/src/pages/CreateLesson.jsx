import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function CreateLesson() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    contentType: "video",
    contentUrl: "",
    content: "",
    orderIndex: "",
    isPreview: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.orderIndex) {
      toast.error("Title and order are required");
      return;
    }

    setLoading(true);

    try {
       await api.post(`/courses/${courseId}/lessons`, {
        title: formData.title,
        contentType: formData.contentType,
        contentUrl: formData.contentUrl || null,
        content: formData.content || null,
        orderIndex: Number(formData.orderIndex),
        isPreview: formData.isPreview,
      });

      toast.success("Lesson created successfully");
      navigate(`/instructor/courses/${courseId}/lessons`);
    } catch (error) {
      console.error("Create lesson error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create lesson"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <Link
            to={`/instructor/courses/${courseId}/lessons`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Lessons
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Instructor
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create Lesson
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Add a new lesson to this course
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-300">
              Lesson Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Introduction to React Hooks"
              className={inputClasses}
            />
          </div>

          {/* Content Type + Order */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contentType" className="mb-1.5 block text-sm font-medium text-slate-300">
                Content Type
              </label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="video">Video</option>
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
            </div>

            <div>
              <label htmlFor="orderIndex" className="mb-1.5 block text-sm font-medium text-slate-300">
                Order <span className="text-rose-400">*</span>
              </label>
              <input
                id="orderIndex"
                type="number"
                name="orderIndex"
                value={formData.orderIndex}
                onChange={handleChange}
                required
                min="1"
                placeholder="1"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Content URL – shown for video / file */}
          {(formData.contentType === "video" || formData.contentType === "file") && (
            <div>
              <label htmlFor="contentUrl" className="mb-1.5 block text-sm font-medium text-slate-300">
                {formData.contentType === "video" ? "Video URL" : "File URL"}
              </label>
              <input
                id="contentUrl"
                type="url"
                name="contentUrl"
                value={formData.contentUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClasses}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Paste a direct link to the {formData.contentType}
              </p>
            </div>
          )}

          {/* Content – shown for text (and optional for others) */}
          {formData.contentType === "text" && (
            <div>
              <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-slate-300">
                Lesson Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                placeholder="Write the lesson content here..."
                className={`${inputClasses} resize-none`}
              />
            </div>
          )}

          {/* Optional content field for video/file notes */}
          {(formData.contentType === "video" || formData.contentType === "file") && (
            <div>
              <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-slate-300">
                Notes / Description <span className="text-slate-500">(optional)</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={4}
                placeholder="Optional notes for this lesson..."
                className={`${inputClasses} resize-none`}
              />
            </div>
          )}

          {/* Preview toggle */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 transition-colors hover:bg-white/[0.04]">
            <input
              type="checkbox"
              name="isPreview"
              checked={formData.isPreview}
              onChange={handleChange}
              className="h-4 w-4 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">
                Allow preview
              </p>
              <p className="text-xs text-slate-500">
                Students can view this lesson without enrolling
              </p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              to={`/instructor/courses/${courseId}/lessons`}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Lesson"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLesson;