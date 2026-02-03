import React, { useState } from "react";
import {
  X,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Sparkles,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

// form validation using zod
const signUpSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const SignUpPage: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = signUpSchema.safeParse({
      userName,
      email,
      password,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { userName, email, password },
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        setUserName("");
        setEmail("");
        setPassword("");
        navigate("/login"); // Redirect to login after successful signup
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Registration failed. Try again.",
      );
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
        <div className="absolute right-6 top-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#dd2d4a] to-[#880d1e] mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#dd2d4a]" />
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Choose a username"
                className={`w-full pl-12 pr-4 py-4 bg-white border-2 ${
                  errors.userName ? "border-red-300" : "border-gray-200"
                } rounded-xl focus:outline-none focus:border-[#dd2d4a] focus:ring-3 focus:ring-[#f49cbb]/20 transition-all duration-200`}
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (errors.userName) setErrors({ ...errors, userName: "" });
                }}
                required
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {errors.userName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {errors.userName}
              </p>
            )}
          </div>

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
                required
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
                placeholder="Create a strong password"
                className={`w-full pl-12 pr-12 py-4 bg-white border-2 ${
                  errors.password ? "border-red-300" : "border-gray-200"
                } rounded-xl focus:outline-none focus:border-[#dd2d4a] focus:ring-3 focus:ring-[#f49cbb]/20 transition-all duration-200`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                required
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
            <div className="mt-2 text-xs text-gray-500">
              Must be at least 6 characters long
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-gradient-to-r from-[#dd2d4a] via-[#880d1e] to-[#f49cbb] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#dd2d4a]/40 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
          </button>

  
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#dd2d4a] hover:text-[#880d1e] transition-colors relative group"
            >
              Login Now
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-[#f49cbb] to-[#dd2d4a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </p>
        </div>

        
      </div>
    </div>
  );
};

export default SignUpPage;
