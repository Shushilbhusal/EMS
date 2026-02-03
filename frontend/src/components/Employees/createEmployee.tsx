import axios from "axios";
import React, { useState } from "react";
import z from "zod";
import type { EmployeeType } from "./employee";
import { User, Mail, ArrowRight } from "lucide-react";

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  salary: number;
}

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  salary: z.number().min(0, "Salary must be a positive number"),
});

const EmployeeCreateForm: React.FC<{
  onClose: () => void;
  onSuccess: (employee: EmployeeType) => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    salary: null as unknown as number,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "salary"
          ? value === ""
            ? (null as unknown as number)
            : Number(value)
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = employeeSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/employee/create`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 201 && response.data.data) {
        alert(response.data.message);
        onSuccess(response.data.data);
        onClose();
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Error creating employee"
        : "Error creating employee";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5 md:space-y-6"
      >
        {/* First Name & Last Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#dd2d4a]" />
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ram"
                className={`w-full pl-3 pr-3 sm:pl-4 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base bg-white border-2 ${
                  errors.firstName ? "border-red-300" : "border-gray-200"
                } rounded-lg sm:rounded-xl focus:outline-none focus:border-[#dd2d4a] focus:ring-2 sm:focus:ring-3 focus:ring-[#f49cbb]/20 transition-all duration-200`}
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#dd2d4a]" />
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Thapa"
                className={`w-full pl-3 pr-3 sm:pl-4 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base bg-white border-2 ${
                  errors.lastName ? "border-red-300" : "border-gray-200"
                } rounded-lg sm:rounded-xl focus:outline-none focus:border-[#dd2d4a] focus:ring-2 sm:focus:ring-3 focus:ring-[#f49cbb]/20 transition-all duration-200`}
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#dd2d4a]" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ram123@gmail.com"
              className={`w-full pl-3 pr-3 sm:pl-4 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base bg-white border-2 ${
                errors.email ? "border-red-300" : "border-gray-200"
              } rounded-lg sm:rounded-xl focus:outline-none focus:border-[#dd2d4a] focus:ring-2 sm:focus:ring-3 focus:ring-[#f49cbb]/20 transition-all duration-200`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {errors.email}
            </p>
          )}
        </div>

        {/* Salary Field */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
            <span className="text-[#dd2d4a] text-sm sm:text-base font-medium">
              Rs.
            </span>
            Salary
          </label>
          <div className="relative">
            <input
              type="number"
              name="salary"
              value={formData.salary || ""}
              onChange={handleChange}
              placeholder="50000"
              min={0}
              className={`w-full pl-3 pr-10 sm:pl-4 sm:pr-12 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base bg-white border-2 ${
                errors.salary ? "border-red-300" : "border-gray-200"
              } rounded-lg sm:rounded-xl focus:outline-none focus:border-[#dd2d4a] focus:ring-2 sm:focus:ring-3 focus:ring-[#f49cbb]/20 transition-all duration-200 appearance-none`}
            />
          </div>
          {errors.salary && (
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {errors.salary}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex justify-center items-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 w-40 sm:py-3 md:py-3.5 px-4 border-2 border-gray-300 text-gray-700 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-60 py-2.5 sm:py-3 md:py-3.5 px-4 bg-gradient-to-r from-[#dd2d4a] via-[#880d1e] to-[#f49cbb] text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-lg sm:hover:shadow-2xl hover:shadow-[#dd2d4a]/40 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs sm:text-sm md:text-base">
                  Creating...
                </span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-sm md:text-base">
                  Create Employee
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300" />
              </>
            )}
            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreateForm;
