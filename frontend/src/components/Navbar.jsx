import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = (role) => {
    const roles = {
      student: "/student/dashboard",
      instructor: "/instructor/dashboard",
      admin: "/admin/dashboard",
    };
    return roles[role] || "/";
  };

  // Logo destination: dashboard when logged in, home when not
  const logoPath = user ? getDashboardPath(user.role) : "/";

  const navLinkClasses = (path) =>
    `relative px-1 py-2 text-sm font-medium tracking-wide transition-all duration-200 ${
      isActive(path)
        ? "text-white"
        : "text-slate-400 hover:text-white"
    } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-indigo-400 after:to-violet-500 after:transition-all after:duration-300 ${
      isActive(path) ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand - now points to dashboard when logged in */}
          <Link
            to={logoPath}
            className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
              <span className="text-sm font-black tracking-tighter text-white">L</span>
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-white">
                LearnHub
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                Education Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Primary Links */}
            <div className="hidden items-center gap-6 md:flex">
              <Link to="/courses" className={navLinkClasses("/courses")}>
                Courses
              </Link>
            </div>

            {/* Authenticated / Guest Actions */}
            {user ? (
              <div className="ml-4 flex items-center gap-3 sm:ml-6 sm:gap-4 border-l border-white/10 pl-4 sm:pl-6">
                
                <Link
                  to={getDashboardPath(user.role)}
                  className={navLinkClasses(getDashboardPath(user.role))}
                >
                  Dashboard
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="group flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3 transition-all duration-200 hover:bg-white/5"
                >
                  <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-md shadow-indigo-500/20 ring-2 ring-slate-900 transition-all duration-300 group-hover:ring-indigo-400/50">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {user.name?.split(" ")[0] || "Profile"}
                    </p>
                  </div>
                </Link>

                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="ml-4 flex items-center gap-3 sm:ml-6 border-l border-white/10 pl-4 sm:pl-6">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;