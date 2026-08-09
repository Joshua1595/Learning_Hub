import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { updateCourse } from "../services/courseService";

function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    price: "",
    level: "beginner",
    thumbnailUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/my-courses/${courseId}`);
        const course = response.data.course || response.data;

        setFormData({
          title: course.title || "",
          description: course.description || "",
          categoryId: course.category_id || "",
          price: course.price ?? "",
          level: course.level || "beginner",
          thumbnailUrl: course.thumbnail_url || "",
        });
      } catch (error) {
        console.error("Fetch course error:", error);
        toast.error(
          error.response?.data?.message || "Could not load course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId || null,
        price: Number(formData.price) || 0,
        level: formData.level,
        thumbnailUrl: formData.thumbnailUrl || null,
      };

      await updateCourse(courseId, courseData);
      toast.success("Course updated successfully");
      navigate("/instructor/dashboard");
    } catch (error) {
      console.error("Update course error:", error);
      toast.error(
        error.response?.data?.message || "Could not update course"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20";

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 w-32 rounded bg-white/10 mb-6" />
          <div className="h-9 w-56 rounded-lg bg-white/10 mb-3" />
          <div className="h-5 w-72 rounded bg-white/5 mb-10" />
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 space-y-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="space-y-2">
                <div className="h-4 w-24 rounded bg-white/10" />
                <div className="h-11 w-full rounded-xl bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            to="/instructor/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Instructor
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Edit Course
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Update your course details below
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
              Course Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Full-Stack Web Development"
              className={inputClasses}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-300">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe what students will learn..."
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Level + Price */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="level" className="mb-1.5 block text-sm font-medium text-slate-300">
                Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-slate-300">
                Price (USD)
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0 for free"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Category ID */}
          <div>
            <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium text-slate-300">
              Category ID
            </label>
            <input
              id="categoryId"
              type="text"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              placeholder="Optional category UUID"
              className={inputClasses}
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label htmlFor="thumbnailUrl" className="mb-1.5 block text-sm font-medium text-slate-300">
              Thumbnail URL
            </label>
            <input
              id="thumbnailUrl"
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={inputClasses}
            />
          </div>

          {/* Thumbnail preview */}
          {formData.thumbnailUrl && (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <img
                src={formData.thumbnailUrl}
                alt="Thumbnail preview"
                className="h-40 w-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/instructor/dashboard")}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;