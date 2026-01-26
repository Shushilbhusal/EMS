import React, { useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

type UserType = {
  id: string;
  email: string;
  userName: string;
  Role: string;
  profileImage: string;
};

const Navbar: React.FC = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = React.useState<UserType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLoggedOut = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      { withCredentials: true },
    );
    if (response.status === 200) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (!token) return;

    const getProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            withCredentials: true,
          },
        );
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    getProfile();
  }, [token]);

  return (
    <nav className="bg-gradient-to-r sticky top-0 z-50 from-white py-1 to-gray-50 shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand/Logo */}
          <div
            className="text-3xl font-bold hover:cursor-pointer flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <div className="w-20 h-10 rounded-lg bg-gradient-to-br from-[#dd2d4a] to-[#880d1e] flex items-center justify-center">
              <span className="text-white font-bold">EMS</span>
            </div>
          </div>

          {/* Desktop Navigation - Right side */}
          <div className="hidden md:flex items-center gap-6">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="group relative bg-gradient-to-r from-[#dd2d4a] via-[#880d1e] to-[#f49cbb] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#dd2d4a]/40 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  Sign Up
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
                  {/* Avatar */}
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="User"
                      className="w-9 h-9 rounded-full object-cover border-gray-300 border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dd2d4a] to-[#880d1e] text-white flex items-center justify-center font-semibold">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-black">
                      {user?.userName || user?.email?.split("@")[0]}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                    </span>
                  </div>
                </div>

                {/* Dashboard Button */}
                <button
                  onClick={() => navigate("/employees")}
                  className="flex items-center gap-2 text-gray-700 hover:text-black bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 border border-gray-200"
                >
                  <MdDashboard className="text-xl" />
                  <span className="hidden lg:inline">Dashboard</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLoggedOut}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-xl transition-all duration-200 hover:from-[#880d1e] hover:to-[#dd2d4a] transform hover:-translate-y-0.5 active:scale-95"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-black p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {!token ? (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-black font-medium px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* User Info */}
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-lg">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover "
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#dd2d4a] to-[#880d1e] text-white flex items-center justify-center font-semibold">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-black">
                      {user?.userName || user?.email?.split("@")[0]}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {user?.Role?.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Dashboard Button */}
                <button
                  onClick={() => {
                    navigate("/employees");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-gray-700 hover:text-black px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <MdDashboard className="text-xl" />
                  <span>Dashboard</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLoggedOut();
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
