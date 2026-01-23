import React from "react";
import axios from "axios";
import { DeleteIcon, Edit2, PlusIcon, Search } from "lucide-react";
import EmployeeCreateForm from "./createEmployee";
import UpdateEmployee from "./updateEmployee";

export type EmployeeType = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  salary: number;
};

type SortField = "name" | "salary" | null;
type SortOrder = "asc" | "desc";

const Employee = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [employees, setEmployees] = React.useState<EmployeeType[]>([]);
  const [isCreateModelOpen, setIsCreateModelOpen] = React.useState(false);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<EmployeeType | null>(null);
  const [sortField, setSortField] = React.useState<SortField>(null);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc");

  const addEmployeeToUI = (newEmployee: EmployeeType) => {
    setEmployees((prev) => [newEmployee, ...prev]);
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
        const response = await axios.get<EmployeeType[]>(
          `${import.meta.env.VITE_API_URL}/api/employee/getAll`,
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Management System
          </h1>
          <p className="text-gray-600 mt-1">
            {employees.length} employees found
          </p>
        </div>
        <button
          onClick={() => setIsCreateModelOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon size={20} />
          Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 w-full  items-center mb-4 ">
        <div className="relative mb-6 w-[85%]  ">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search employees by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-[100%]"
          />
        </div>
        <div className="flex gap-3 mb-4">
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortField(field === "null" ? null : (field as SortField));
              setSortOrder(order as SortOrder);
            }}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="null-asc">No Sorting</option>
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="salary-asc">Salary (Low → High)</option>
            <option value="salary-desc">Salary (High → Low)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      Rs.{employee.salary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setIsUpdateModelOpen(true);
                          setSelectedEmployee(employee);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(employee?.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <DeleteIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No employees found matching your search
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isCreateModelOpen && (
        <div className="fixed inset-0 backdrop-blur-[4px] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] ">
            <EmployeeCreateForm
              onClose={() => setIsCreateModelOpen(false)}
              onSuccess={addEmployeeToUI}
            />
          </div>
        </div>
      )}

      {isUpdateModelOpen && selectedEmployee && (
        <div className="fixed inset-0 backdrop-blur-[4px] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
