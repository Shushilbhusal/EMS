/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { RxCrossCircled } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod validation
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);
      // alert(response.data.message);
      toast.success(response.data.message, {
        position: "bottom-right",
      });
      navigate("/employees");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#f49cbb]/10 to-[#dd2d4a]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#880d1e]/10 to-[#dd2d4a]/5 rounded-full blur-3xl"></div>

      <div className="bg-white/80 backdrop-blur-sm shadow-2xl relative rounded-3xl p-8 md:p-12 w-full max-w-lg border border-gray-200">
        {/* Close Button */}
        <Link to="/">
          <div className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <RxCrossCircled className="text-2xl text-gray-500 hover:text-gray-700" />
          </div>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#dd2d4a] to-[#880d1e] mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to access your employee dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#dd2d4a]" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-12 pr-4 py-4 bg-white border-2 ${
                  errors.email ? "border-red-300" : "border-gray-200"
                } rounded-xl focus:outline-none focus:border-[#dd2d4a] focus:ring-3 focus:ring-[#f49cbb]/20 transition-all duration-200`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#dd2d4a]" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full pl-12 pr-12 py-4 bg-white border-2 ${
                  errors.password ? "border-red-300" : "border-gray-200"
                } rounded-xl focus:outline-none focus:border-[#dd2d4a] focus:ring-3 focus:ring-[#f49cbb]/20 transition-all duration-200`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {errors.password}
              </p>
            )}
          </div>

          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-gradient-to-r  from-[#dd2d4a] via-[#880d1e] to-[#f49cbb] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#dd2d4a]/40 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
          </button>

        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#dd2d4a] hover:text-[#880d1e] transition-colors relative group"
            >
              Sign Up Now
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-[#f49cbb] to-[#dd2d4a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </p>
        </div>

        
      </div>
    </div>
  );
};

export default LoginPage;