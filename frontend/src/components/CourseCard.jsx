import { Link } from "react-router-dom";

function CourseCard({ course }) {
  const isFree = course.price === 0 || !course.price;

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/30 hover:bg-white/[0.05]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        {course.thumbnail_url || course.image ? (
          <img
            src={course.thumbnail_url || course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600/20 to-violet-600/20">
            <span className="text-3xl font-bold text-indigo-300/50">
              {course.title?.substring(0, 2).toUpperCase() || "LH"}
            </span>
          </div>
        )}

        {/* Level badge */}
        {course.level && (
          <span className="absolute top-3 right-3 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-xs font-semibold capitalize text-white backdrop-blur-md">
            {course.level}
          </span>
        )}

        {/* Price badge */}
        <span
          className={`absolute top-3 left-3 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
            isFree
              ? "bg-emerald-500/90 text-white"
              : "border border-white/10 bg-black/50 text-white"
          }`}
        >
          {isFree ? "Free" : `$${course.price}`}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        {course.category_name && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {course.category_name}
          </p>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold text-white min-h-[3.5rem] group-hover:text-indigo-200 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {course.description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-5">
          {course.instructor_name ? (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white">
                {course.instructor_name.substring(0, 1).toUpperCase()}
              </div>
              <span className="text-xs text-slate-400 truncate max-w-[100px]">
                {course.instructor_name}
              </span>
            </div>
          ) : (
            <div />
          )}

          <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
            View Course
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;