import React from "react";
import axios from "axios";
import { DeleteIcon, Edit2, PlusIcon, Search, Filter, X } from "lucide-react";
import EmployeeCreateForm from "./createEmployee";
import UpdateEmployee from "./updateEmployee";
import { useNavigate } from "react-router-dom";

export type EmployeeType = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  salary: number;
};

type SortField = "name" | "salary" | null;
type SortOrder = "asc" | "desc";

type PaginationMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
};

type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationMeta;
};

const Employee = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [employees, setEmployees] = React.useState<EmployeeType[]>([]);
  const [isCreateModelOpen, setIsCreateModelOpen] = React.useState(false);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<EmployeeType | null>(null);
  const [sortField, setSortField] = React.useState<SortField>(null);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [limit] = React.useState(5); // fixed per page
  const [totalPages, setTotalPages] = React.useState(1);

  const navigate = useNavigate();

  const addEmployeeToUI = (newEmployee: EmployeeType) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const addUpdatedEmployeeToUI = (updatedEmployee: EmployeeType) => {
    setEmployees((prev) => [
      updatedEmployee,
      ...prev.filter((emp) => emp.id !== updatedEmployee.id),
    ]);
  };

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<PaginatedResponse<EmployeeType>>(
          `${import.meta.env.VITE_API_URL}/api/employee/getAll`,

          {
            params: {
              page: currentPage,
              limit,
            },
            withCredentials: true,
          },
        );

        setEmployees(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          navigate("/403");
          return;
        }
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [currentPage, limit, navigate]);

  const handleDelete = async (id: string | undefined) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/employee/delete/${id}`,
          { withCredentials: true },
        );
        if (response.status === 200) {
          alert(response.data.message);
          setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert(error);
      }
    }
  };

  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      if (sortField === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      if (sortField === "salary") {
        return sortOrder === "asc" ? a.salary - b.salary : b.salary - a.salary;
      }

      return 0;
    });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dd2d4a] to-[#880d1e] flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Employee Management
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#f49cbb]"></span>
                {employees.length} employees found
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModelOpen(true)}
          className="group relative bg-gradient-to-r from-[#dd2d4a] via-[#880d1e] to-[#f49cbb] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#dd2d4a]/40 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <PlusIcon
            size={20}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          Add Employee
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 mb-8 border border-gray-200 shadow-sm ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Search Bar */}
          <div>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl
                 focus:outline-none focus:border-[#dd2d4a] focus:ring-2 focus:ring-[#f49cbb]/20
                 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2"></div>

            {/* Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl
                hover:border-gray-300 focus:outline-none focus:border-[#dd2d4a]
                 focus:ring-2 focus:ring-[#f49cbb]/20 transition-all duration-200
                 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      !sortField
                        ? "bg-gradient-to-br from-gray-100 to-gray-200"
                        : sortField === "name"
                          ? "bg-gradient-to-br from-[#f49cbb] to-[#dd2d4a]"
                          : "bg-gradient-to-br from-[#880d1e] to-[#dd2d4a]"
                    }`}
                  >
                    {!sortField ? (
                      <Filter size={16} className="text-gray-600" />
                    ) : sortField === "name" ? (
                      <span className="text-white font-bold text-sm">A</span>
                    ) : (
                      <span className="text-white font-bold text-sm">Rs</span>
                    )}
                  </div>

                  <span className="text-gray-700 font-medium">
                    {!sortField
                      ? "No Sorting"
                      : sortField === "name"
                        ? `Name (${sortOrder === "asc" ? "A→Z" : "Z→A"})`
                        : `Salary (${sortOrder === "asc" ? "Low→High" : "High→Low"})`}
                  </span>
                </div>

                {/* Arrow Icon */}
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isSortDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Gradient Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#dd2d4a] via-[#f49cbb] to-[#880d1e] rounded-xl opacity-0 group-hover:opacity-30 blur transition-all duration-300 pointer-events-none -z-10"></div>

              {/* Dropdown Menu */}
              {isSortDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                  {/* Option 1: No Sorting */}
                  <button
                    onClick={() => {
                      setSortField(null);
                      setSortOrder("asc");
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-4 flex items-center gap-3 transition-all duration-200 ${
                      !sortField
                        ? "bg-gradient-to-r from-gray-50 to-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        !sortField
                          ? "bg-gradient-to-br from-gray-200 to-gray-300 ring-2 ring-gray-300"
                          : "bg-gray-100"
                      }`}
                    >
                      <Filter
                        size={18}
                        className={`${!sortField ? "text-gray-700" : "text-gray-500"}`}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className={`font-medium ${!sortField ? "text-gray-900" : "text-gray-700"}`}
                      >
                        No Sorting
                      </span>
                      <span className="text-sm text-gray-500">
                        Default order
                      </span>
                    </div>
                    {!sortField && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>

                  <div className="border-t border-gray-100"></div>

                  {/* Option 2: Name A-Z */}
                  <button
                    onClick={() => {
                      setSortField("name");
                      setSortOrder("asc");
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-4 flex items-center gap-3 transition-all duration-200 ${
                      sortField === "name" && sortOrder === "asc"
                        ? "bg-gradient-to-r from-[#f49cbb]/10 to-[#dd2d4a]/10"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        sortField === "name" && sortOrder === "asc"
                          ? "bg-gradient-to-br from-[#f49cbb] to-[#dd2d4a] ring-2 ring-[#f49cbb]/30"
                          : "bg-gradient-to-br from-gray-100 to-gray-200"
                      }`}
                    >
                      <span
                        className={`font-bold ${sortField === "name" && sortOrder === "asc" ? "text-white" : "text-gray-700"}`}
                      >
                        A→Z
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className={`font-medium ${
                          sortField === "name" && sortOrder === "asc"
                            ? "text-[#880d1e]"
                            : "text-gray-700"
                        }`}
                      >
                        Name (A → Z)
                      </span>
                      <span className="text-sm text-gray-500">
                        Alphabetical order
                      </span>
                    </div>
                    {sortField === "name" && sortOrder === "asc" && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Option 3: Name Z-A */}
                  <button
                    onClick={() => {
                      setSortField("name");
                      setSortOrder("desc");
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-4 flex items-center gap-3 transition-all duration-200 ${
                      sortField === "name" && sortOrder === "desc"
                        ? "bg-gradient-to-r from-[#f49cbb]/10 to-[#dd2d4a]/10"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        sortField === "name" && sortOrder === "desc"
                          ? "bg-gradient-to-br from-[#880d1e] to-[#dd2d4a] ring-2 ring-[#880d1e]/30"
                          : "bg-gradient-to-br from-gray-100 to-gray-200"
                      }`}
                    >
                      <span
                        className={`font-bold ${sortField === "name" && sortOrder === "desc" ? "text-white" : "text-gray-700"}`}
                      >
                        Z→A
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className={`font-medium ${
                          sortField === "name" && sortOrder === "desc"
                            ? "text-[#880d1e]"
                            : "text-gray-700"
                        }`}
                      >
                        Name (Z → A)
                      </span>
                      <span className="text-sm text-gray-500">
                        Reverse alphabetical
                      </span>
                    </div>
                    {sortField === "name" && sortOrder === "desc" && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>

                  <div className="border-t border-gray-100"></div>

                  {/* Option 4: Salary Low to High */}
                  <button
                    onClick={() => {
                      setSortField("salary");
                      setSortOrder("asc");
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-4 flex items-center gap-3 transition-all duration-200 ${
                      sortField === "salary" && sortOrder === "asc"
                        ? "bg-gradient-to-r from-[#f49cbb]/10 to-[#dd2d4a]/10"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        sortField === "salary" && sortOrder === "asc"
                          ? "bg-gradient-to-br from-emerald-400 to-green-500 ring-2 ring-emerald-200"
                          : "bg-gradient-to-br from-gray-100 to-gray-200"
                      }`}
                    >
                      <span
                        className={`font-bold ${sortField === "salary" && sortOrder === "asc" ? "text-white" : "text-gray-700"}`}
                      >
                        Rs.↑
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className={`font-medium ${
                          sortField === "salary" && sortOrder === "asc"
                            ? "text-emerald-700"
                            : "text-gray-700"
                        }`}
                      >
                        Salary (Low → High)
                      </span>
                      <span className="text-sm text-gray-500">
                        Ascending order
                      </span>
                    </div>
                    {sortField === "salary" && sortOrder === "asc" && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Option 5: Salary High to Low */}
                  <button
                    onClick={() => {
                      setSortField("salary");
                      setSortOrder("desc");
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-4 flex items-center gap-3 transition-all duration-200 ${
                      sortField === "salary" && sortOrder === "desc"
                        ? "bg-gradient-to-r from-[#f49cbb]/10 to-[#dd2d4a]/10"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        sortField === "salary" && sortOrder === "desc"
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-amber-200"
                          : "bg-gradient-to-br from-gray-100 to-gray-200"
                      }`}
                    >
                      <span
                        className={`font-bold ${sortField === "salary" && sortOrder === "desc" ? "text-white" : "text-gray-700"}`}
                      >
                        Rs.↓
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className={`font-medium ${
                          sortField === "salary" && sortOrder === "desc"
                            ? "text-amber-700"
                            : "text-gray-700"
                        }`}
                      >
                        Salary (High → Low)
                      </span>
                      <span className="text-sm text-gray-500">
                        Descending order
                      </span>
                    </div>
                    {sortField === "salary" && sortOrder === "desc" && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f49cbb] to-[#dd2d4a] flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {employee.firstName.charAt(0)}
                          {employee.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 group-hover:text-black">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {employee.id?.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-gray-700 group-hover:text-gray-900">
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {employee.salary.toLocaleString()}
                      </span>
                      <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                        /month
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setIsUpdateModelOpen(true);
                          setSelectedEmployee(employee);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:text-blue-800 rounded-xl hover:shadow-md transition-all duration-200 border border-blue-100 group/btn"
                        title="Edit Employee"
                      >
                        <Edit2
                          size={16}
                          className="group-hover/btn:rotate-12 transition-transform"
                        />
                        <span className="font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(employee?.id)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-pink-50 text-[#dd2d4a] hover:text-[#880d1e] rounded-xl hover:shadow-md transition-all duration-200 border border-red-100 group/btn2"
                        title="Delete Employee"
                      >
                        <DeleteIcon
                          size={16}
                          className="group-hover/btn2:scale-110 transition-transform"
                        />
                        <span className="font-medium">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium
        ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700"
        }`}
              >
                Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium
          ${
            currentPage === page
              ? "bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] text-white"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium
        ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700"
        }`}
              >
                Next
              </button>
            </div>
          )}

          {filteredEmployees.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No employees found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search term"
                  : "Start by adding your first employee"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsCreateModelOpen(true)}
                  className="mt-6 bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                >
                  <PlusIcon size={20} />
                  Add First Employee
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      {filteredEmployees.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredEmployees.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {employees.length}
              </span>{" "}
              employees
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#dd2d4a]"></div>
              <span className="text-sm text-gray-600">
                Total salary: Rs.
                <span className="font-semibold text-gray-900">
                  {filteredEmployees
                    .reduce((sum, emp) => sum + emp.salary, 0)
                    .toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isCreateModelOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-fadeIn">
            <div className="bg-gradient-to-r from-[#dd2d4a] to-[#880d1e] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <PlusIcon className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Add New Employee
                  </h2>
                </div>
                <button
                  onClick={() => setIsCreateModelOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <EmployeeCreateForm
              onClose={() => setIsCreateModelOpen(false)}
              onSuccess={addEmployeeToUI}
            />
          </div>
        </div>
      )}

      {isUpdateModelOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-fadeIn">
            <div className="bg-gradient-to-r from-[#880d1e] to-[#dd2d4a] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Edit2 className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Update Employee
                  </h2>
                </div>
                <button
                  onClick={() => setIsUpdateModelOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <UpdateEmployee
              onClose={() => setIsUpdateModelOpen(false)}
              employee={selectedEmployee}
              onSuccess={addUpdatedEmployeeToUI}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
