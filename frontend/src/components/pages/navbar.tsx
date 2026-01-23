import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // for navigation if needed
import axios from "axios";

const Navbar: React.FC = () => {
  const token = localStorage.getItem("token");
  const handleLoggedOut=async ()=>{
    const response =await  axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {withCredentials: true}
    );
    if(response.status===200){
      localStorage.removeItem("token");
      window.location.href="/";
    }
  }
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left: Brand */}
        <div className="text-2xl font-bold text-blue-600">EMS</div>

        {/* Right: Login / Sign Up */}
        {!token ? (
          <div className="flex gap-4">
            {/* Login Button */}
            <Link
              to="/login"
              className="px-5 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-all"
            >
              Login
            </Link>

            {/* Sign Up Button */}
            <Link
              to="/signup"
              className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              Sign Up
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <button className="flex items-center gap-2 rounded-lg bg-red-400 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg active:scale-95"
          onClick={()=>{handleLoggedOut()}}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
