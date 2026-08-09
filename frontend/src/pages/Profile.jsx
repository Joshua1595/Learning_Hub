import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);

  const getDashboardPath = (role) => {
    const roles = {
      student: "/student/dashboard",
      instructor: "/instructor/dashboard",
      admin: "/admin/dashboard",
    };
    return roles[role] || "/";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-lg items-center justify-center px-4 py-16">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Account
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Your Profile
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your personal information
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Avatar + Name */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/30 ring-4 ring-slate-950">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-950 bg-emerald-500">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white">
                {user?.name || "User"}
              </h2>
              <p className="mt-1 text-sm text-slate-400 capitalize">
                {user?.role || "Member"}
              </p>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-white/10" />

            {/* Info fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3.5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Full Name
                </p>
                <p className="text-sm font-medium text-white">
                  {user?.name || "—"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3.5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email Address
                </p>
                <p className="text-sm font-medium text-white">
                  {user?.email || "—"}
                </p>
              </div>

              {/* Role */}
              <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3.5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Role
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-300">
                    {user?.role || "Member"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <Link
                to={getDashboardPath(user?.role)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Go to Dashboard
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                to="/courses"
                className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-600">
            Need to update your details? Contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;