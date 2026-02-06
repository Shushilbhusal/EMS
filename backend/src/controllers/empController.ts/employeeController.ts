// import prisma from "../../lib/db.js";
import { AppError } from "../../lib/appError.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { employeeModel } from "../../models/empModel.js";
import type { Request, Response } from "express";

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const { data, total } = await employeeModel.getAllEmployees(page, limit);
    res.status(200).json({
      data,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// Get single employee by ID
export const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid employee id" });
    }
    const employee = await employeeModel.getEmployeeById(id);

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
};

// Create new employee
export const createEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, salary } = req.body;

    if (!firstName || !lastName || !email || !salary) {
      throw new AppError("All fields are required", 400);
    }

    const newEmployee = await employeeModel.createEmployee({
      firstName,
      lastName,
      email,
      salary,
    });

    res.status(201).json({
      message: "Employee created successfully",
      data: newEmployee,
    });
  },
);

// Update employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, salary } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid employee id" });
    }

    if (!firstName || !lastName || !email || !salary) {
      return res.status(400).json({ error: "all fields are required" });
    }

    const updatedEmployee = await employeeModel.updateEmployee(id, {
      firstName,
      lastName,
      email,
      salary,
    });
    res.status(200).json({
      message: "Updated Successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee" });
  }
};

// Delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid employee id" });
    }

    const deleted = await employeeModel.deleteEmployee(id);

    if (!deleted) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
};
