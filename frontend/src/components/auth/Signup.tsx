import React, { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import axios from "axios";

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
  const [errors, setErrors] = useState<Record<string, string>>({});



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

      validationResult.error.issues.forEach((err: any) => {
        const fieldName = err.path[0] as string;
        fieldErrors[fieldName] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }
    console.log(userName,email,password)

    // Clear errors if validation passes
    setErrors({});
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { userName, email, password },
      );
      if (response.status === 201) {
        alert(response.data.message);
        setUserName("");
        setEmail("");
        setPassword("");
      }
    } catch (error:any) {
      alert(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 relative">
      <div className="bg-white relative shadow-2xl rounded-2xl p-10 w-full max-w-md relative">
        <div className="absolute right-2 top-0">
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          {errors.userName && (
            <p className="text-red-500 text-sm">{errors.userName}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <button
            type="submit"
            className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
          >
            Sign Up
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
