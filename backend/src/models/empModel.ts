import type { Employee } from "../types/userType.js";
import { pool } from "../config/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";

export interface UpdateEmployeeDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  salary?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}


export const employeeModel = {
  // GET ALL
  getAllEmployees: async (page: number, limit: number): Promise<PaginatedResult<Employee>> => {
    const offset = (page - 1) * limit; // page=current page number, limit=rows per page
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM employee ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset],
    );

    // get total count
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM employee`,
    );
    const total = countRows[0]?.total as number;
    // A type for a row returned from a SELECT query in mysql2

    return {
      data: rows as Employee[],
      total,
    };
  },

  // GET ONE
  getEmployeeById: async (id: string): Promise<Employee | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM employee WHERE id = ?",
      [id],
    );
    return rows.length ? (rows[0] as Employee) : null;
  },

  // CREATE

  createEmployee: async (
    employee: Omit<Employee, "id" | "createdAt" | "updatedAt">,
  ): Promise<Employee> => {
    const { firstName, lastName, email, salary } = employee;
    const id = uuidv4(); // generate a new UUID

    await pool.query(
      `INSERT INTO employee (id, firstName, lastName, email, salary)
     VALUES (?, ?, ?, ?, ?)`,
      [id, firstName, lastName, email, salary],
    );

    // Now we know the id, so we can fetch it
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM employee WHERE id = ?",
      [id],
    );

    return rows[0] as Employee;
  },

  // UPDATE
  updateEmployee: async (
    id: string,
    data: UpdateEmployeeDTO,
  ): Promise<Employee> => {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.firstName !== undefined) {
      fields.push("firstName = ?");
      values.push(data.firstName);
    }
    if (data.lastName !== undefined) {
      fields.push("lastName = ?");
      values.push(data.lastName);
    }
    if (data.email !== undefined) {
      fields.push("email = ?");
      values.push(data.email);
    }
    if (data.salary !== undefined) {
      fields.push("salary = ?");
      values.push(data.salary);
    }

    if (fields.length === 0) {
      throw new Error("No fields provided to update");
    }

    await pool.query(`UPDATE employee SET ${fields.join(", ")} WHERE id = ?`, [
      ...values,
      id,
    ]);

    // Return updated employee
    const updated = await employeeModel.getEmployeeById(id);
    if (!updated) throw new Error("Employee not found after update");
    return updated;
  },

  // DELETE
  deleteEmployee: async (id: string): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM employee WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  },
};
