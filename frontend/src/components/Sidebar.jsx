import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {

  const { user } = useContext(AuthContext);

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">

      <h2 className="text-xl font-bold mb-6">
        Dashboard
      </h2>


      <div className="flex flex-col gap-4">


        <Link to="/profile">
          Profile
        </Link>


        {user?.role === "student" && (
          <>
            <Link to="/student/dashboard">
              My Learning
            </Link>

            <Link to="/courses">
              Browse Courses
            </Link>
          </>
        )}



        {user?.role === "instructor" && (
          <>
            <Link to="/instructor/dashboard">
              Instructor Dashboard
            </Link>

            <Link to="/instructor/courses">
              Manage Courses
            </Link>

            <Link to="/instructor/courses/create">
              Create Course
            </Link>
          </>
        )}



        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard">
              Admin Dashboard
            </Link>

            <Link to="/admin/users">
              Manage Users
            </Link>

            <Link to="/admin/courses">
              Manage Courses
            </Link>
          </>
        )}


      </div>


    </aside>
  );
}

export default Sidebar;