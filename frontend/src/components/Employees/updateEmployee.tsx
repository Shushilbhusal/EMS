import axios from "axios";
import React, { useState } from "react";
import { User, Mail, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

interface Employee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  salary: number;
}

const UpdateEmployee: React.FC<{
  onClose: () => void;
  employee: Employee | null;
  onSuccess: (employee: Employee) => void;
}> = ({ onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState<Employee>({
    id: employee?.id,
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    email: employee?.email || "",
    salary: employee?.salary || 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? (value === "" ? 0 : Number(value)) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.salary < 0) newErrors.salary = "Salary must be positive";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/employee/update/${employee?.id}`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        onSuccess(formData);
        onClose();
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Error updating employee"
        : "Error updating employee";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6">
      <form
        onSubmit={handleUpdate}
        className="space-y-4 sm:space-y-5 md:space-y-6"
      >
        {/* First Name & Last Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#880d1e]" />
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
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
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#880d1e]" />
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
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
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#880d1e]" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
            <span className="text-[#880d1e] text-sm sm:text-base font-medium">
              Rs.
            </span>
            Salary
          </label>
          <div className="relative">
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              min={0}
              required
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
        <div className="flex justify-center items-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 w-40 sm:py-3 md:py-3.5 px-4 border-2 border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="group w-40 relative py-2.5 sm:py-3 md:py-3.5 px-4 bg-gradient-to-r from-[#880d1e] via-[#dd2d4a] to-[#f49cbb] text-white font-semibold text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl hover:shadow-lg sm:hover:shadow-2xl hover:shadow-[#dd2d4a]/40 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs sm:text-sm">Updating...</span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-sm md:text-base">Update</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300" />
              </>
            )}
            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#880d1e] to-[#dd2d4a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
