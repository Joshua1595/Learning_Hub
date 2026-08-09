import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createCourse,
  uploadCourseImage,
} from "../services/courseService";

function CreateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    price: "",
    level: "beginner",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Extra frontend validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setThumbnailFile(file);

    // Create local preview
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      let thumbnailUrl = null;

      // 1. Upload image first
      if (thumbnailFile) {
        toast.loading("Uploading thumbnail...", {
          id: "thumbnail-upload",
        });

        const uploadResponse = await uploadCourseImage(thumbnailFile);

        thumbnailUrl = uploadResponse.imageUrl;

        toast.success("Thumbnail uploaded", {
          id: "thumbnail-upload",
        });
      }

      // 2. Create course using returned image URL
      await createCourse({
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId || null,
        price: Number(formData.price) || 0,
        level: formData.level,
        thumbnailUrl,
      });

      toast.success("Course created successfully");

      navigate("/instructor/dashboard");
    } catch (error) {
      console.error("Create course error:", error);

      toast.dismiss("thumbnail-upload");

      toast.error(
        error.response?.data?.message ||
          "Failed to create course"
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
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/instructor/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>

            Back to Dashboard
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Instructor
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create Course
          </h1>

          <p className="mt-2 text-base text-slate-400">
            Fill in the details below to create a new course draft
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Course Title{" "}
              <span className="text-rose-400">*</span>
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
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Description{" "}
              <span className="text-rose-400">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe what students will learn in this course..."
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Level + Price */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="level"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
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
                <option value="intermediate">
                  Intermediate
                </option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
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

          {/* Category */}
          <div>
            <label
              htmlFor="categoryId"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
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

            <p className="mt-1.5 text-xs text-slate-500">
              Leave empty if you don't have a category yet
            </p>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label
              htmlFor="thumbnail"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Course Thumbnail
            </label>

            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-900 text-sm text-slate-400 file:mr-4 file:border-0 file:bg-indigo-600 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG, WEBP, etc. Maximum size: 5MB
            </p>
          </div>

          {/* Thumbnail Preview */}
          {thumbnailPreview && (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-56 w-full object-cover"
                />

                <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  Selected thumbnail
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              to="/instructor/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;