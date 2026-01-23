/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { RxCrossCircled } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import axios from "axios";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      console.log(`${import.meta.env.VITE_API_URL}/api/auth/login`);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
        {withCredentials: true}
      );

      localStorage.setItem("token", response.data.token);
      alert(response.data.message);
      navigate("/employees");
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-2xl relative rounded-2xl p-10 w-full max-w-md">
        <Link to="/">
          <RxCrossCircled className="text-2xl absolute right-7 top-6 cursor-pointer" />
        </Link>

        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold flex justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
