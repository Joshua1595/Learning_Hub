import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAdminDashboard,
  getAdminUsers,
  updateUserRole,
} from "../services/adminService";

function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalEnrollments: 0,
    totalReviews: 0,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);

  useEffect(() => {
    loadDashboard();
    loadUsers();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboard();
      setStatistics(
        data?.statistics || {
          totalUsers: 0,
          totalCourses: 0,
          publishedCourses: 0,
          draftCourses: 0,
          totalEnrollments: 0,
          totalReviews: 0,
        }
      );
    } catch (error) {
      console.error("Admin dashboard error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await getAdminUsers();
      setUsers(data?.users || data || []);
    } catch (error) {
      console.error("Load users error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load users"
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingUser(userId);
      const data = await updateUserRole(userId, role);

      toast.success(data?.message || "User role updated successfully");

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role: data?.user?.role || role }
            : user
        )
      );
    } catch (error) {
      console.error("Update role error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    } finally {
      setUpdatingUser(null);
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: statistics.totalUsers,
      color: "text-white",
      iconBg: "bg-indigo-500/15 text-indigo-400",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-.94M15 19.128v-.003c0-1.054-.24-2.053-.667-2.94M9 19.128v-.003c0-1.054.24-2.053.667-2.94M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        </svg>
      ),
    },
    {
      label: "Total Courses",
      value: statistics.totalCourses,
      color: "text-white",
      iconBg: "bg-violet-500/15 text-violet-400",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      label: "Published Courses",
      value: statistics.publishedCourses,
      color: "text-emerald-400",
      iconBg: "bg-emerald-500/15 text-emerald-400",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
        </svg>
      ),
    },
    {
      label: "Draft Courses",
      value: statistics.draftCourses,
      color: "text-amber-400",
      iconBg: "bg-amber-500/15 text-amber-400",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
    },
    {
      label: "Total Enrollments",
      value: statistics.totalEnrollments,
      color: "text-white",
      iconBg: "bg-cyan-500/15 text-cyan-400",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Total Reviews",
      value: statistics.totalReviews,
      color: "text-white",
      iconBg: "bg-pink-500/15 text-pink-400",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.2 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.855a.562.562 0 0 0-.581 0l-4.725 2.855a.562.562 0 0 1-.84-.61l1.285-5.385a.563.563 0 0 0-.182-.557l-4.2-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 w-32 rounded bg-white/10 mb-3" />
          <div className="h-10 w-72 rounded-lg bg-white/10 mb-2" />
          <div className="h-5 w-96 max-w-full rounded bg-white/5 mb-10" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-32 rounded-2xl border border-white/10 bg-white/5" />
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

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Administration
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-400">
              Manage users, courses, quizzes, and monitor platform activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/instructor/courses/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Course
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              View Courses
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-indigo-500/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Management links */}
        <div className="mb-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">Management</h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage the main resources of your learning platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Link
              to="/instructor/dashboard"
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/[0.05]"
            >
              <p className="text-lg font-semibold text-white">Courses</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create and manage courses, lessons, and course content.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-indigo-400 group-hover:text-indigo-300">
                Manage Courses →
              </span>
            </Link>

            <Link
              to="/courses"
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]"
            >
              <p className="text-lg font-semibold text-white">Course Catalog</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                View all courses currently available on the platform.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-violet-400 group-hover:text-violet-300">
                View Catalog →
              </span>
            </Link>

            <Link
              to="/instructor/dashboard"
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-white/[0.05]"
            >
              <p className="text-lg font-semibold text-white">Quiz Management</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Access course and quiz management tools.
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">
                Manage Quizzes →
              </span>
            </Link>
          </div>
        </div>

        {/* Users table */}
        <div>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <p className="mt-1 text-sm text-slate-400">
                View users and manage student / instructor roles.
              </p>
            </div>
            <span className="text-sm text-slate-500">{users.length} users</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {usersLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-14 animate-pulse rounded-xl bg-white/5" />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-slate-400">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        User
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Role
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Change Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                              {(user.name || user.email || "U")
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {user.name || "Unnamed User"}
                              </p>
                              <p className="mt-0.5 text-sm text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold capitalize ${
                              user.role === "admin"
                                ? "bg-rose-500/10 text-rose-400"
                                : user.role === "instructor"
                                ? "bg-violet-500/10 text-violet-400"
                                : "bg-indigo-500/10 text-indigo-400"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-400">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-5 text-right">
                          {user.role === "admin" ? (
                            <span className="text-xs text-slate-500">
                              Administrator
                            </span>
                          ) : (
                            <select
                              value={user.role}
                              disabled={updatingUser === user.id}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none transition focus:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="student">Student</option>
                              <option value="instructor">Instructor</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;