import express from "express";
import {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/empController.ts/employeeController.js";
import { isLoggedIn } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorization.js";

const router = express.Router();

// GET all employees
router.get("/getAll", isLoggedIn,authorize(["ADMIN"]), getAllEmployees);

// GET single employee by id
router.get("/get/:id", getEmployee);

// POST create new employee
router.post("/create", isLoggedIn, authorize(["ADMIN"]), createEmployee);

// PUT update employee by id
router.put("/update/:id",isLoggedIn, authorize(["ADMIN"]), updateEmployee);

// DELETE employee by id
router.delete("/delete/:id", isLoggedIn, authorize(["ADMIN"]), deleteEmployee);

export default router;
