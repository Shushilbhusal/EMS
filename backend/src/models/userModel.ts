import { pool } from "../config/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { User } from "../types/userType.js";

// DTO for creating a user
export interface CreateUserDTO {
  userName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
}

// DTO for updating a user (partial update)
export interface UpdateUserDTO {
  userName?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "USER";
  profileImage?: string | null | undefined;
  profileImagePublicId?: string | null | undefined; 
  isEmailVerified?: boolean;
  tokenHash? : string;
  tokenExpiry? : Date;
}


export const userModel = {
  // GET user by email
  getUserByEmail: async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    return rows.length ? (rows[0] as User) : null;
  },

  // GET profile by ID (only safe fields)
  getProfileById: async (id: string): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, email, userName, role, profileImage FROM user WHERE id = ?`,
      [id]
    );
    return rows.length ? (rows[0] as User) : null;
  },

  // CREATE new user
  createUser: async (user: CreateUserDTO): Promise<User> => {
    const { userName, email, password, isEmailVerified } = user;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO user (userName, email, password, isEmailVerified)
       VALUES (?, ?, ?, ?)`,
      [userName, email, password, isEmailVerified]
    );

    const insertedId = result.insertId;

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE id = ?",
      [insertedId]
    );

    return rows[0] as User;
  },

  // UPDATE user (partial update)
  updateUser: async (id: string, data: UpdateUserDTO): Promise<User> => {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.userName !== undefined) {
      fields.push("userName = ?");
      values.push(data.userName);
    }
    if (data.email !== undefined) {
      fields.push("email = ?");
      values.push(data.email);
    }
    if (data.password !== undefined) {
      fields.push("password = ?");
      values.push(data.password);
    }
    if (data.role !== undefined) {
      fields.push("role = ?");
      values.push(data.role);
    }
    if (data.profileImage !== undefined) {
      fields.push("profileImage = ?");
      values.push(data.profileImage);
    }
    if (data.profileImagePublicId !== undefined) {
      fields.push("profileImagePublicId = ?");
      values.push(data.profileImagePublicId);
    }
    if (data.isEmailVerified !== undefined) {
      fields.push("isEmailVerified = ?");
      values.push(data.isEmailVerified);
    }

    if (fields.length === 0) {
      throw new Error("No fields provided to update");
    }

    await pool.query<ResultSetHeader>(
      `UPDATE user SET ${fields.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE id = ?",
      [id]
    );

    if (!rows.length) throw new Error("User not found after update");

    return rows[0] as User;
  },

  // DELETE user
  deleteUser: async (id: string): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM user WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
};
