import { pool } from "../config/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { User } from "../types/userType.js";

/* ============================
   DTOs
============================ */

// Create user DTO
export interface CreateUserDTO {
  userName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
}

// Update user DTO (partial update)
export interface UpdateUserDTO {
  userName?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "USER";
  profileImage?: string | undefined;
  profileImagePublicId?: string | undefined;
  isEmailVerified?: boolean;
  tokenHash?: string | null;
  tokenExpiry?: Date | null;
}

/* ============================
   User Model
============================ */

export const userModel = {
  /* ---------- GET USER BY EMAIL ---------- */
  getUserByEmail: async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM user WHERE email = ? LIMIT 1`,
      [email],
    );

    return rows.length ? (rows[0] as User) : null;
  },

  /* ---------- GET PROFILE BY ID (SAFE FIELDS) ---------- */
  getProfileById: async (id: string): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, email, userName, role, profileImage
      FROM user
      WHERE id = ?
      LIMIT 1
      `,
      [id],
    );

    return rows.length ? (rows[0] as User) : null;
  },

  /* ---------- CREATE USER ---------- */
  createUser: async (data: CreateUserDTO): Promise<User> => {
    const { userName, email, password, isEmailVerified } = data;

    const [result] = await pool.query<ResultSetHeader>(
      `
      INSERT INTO user (userName, email, password, isEmailVerified)
      VALUES (?, ?, ?, ?)
      `,
      [userName, email, password, isEmailVerified],
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM user WHERE id = ?`,
      [result.insertId],
    );

    return rows[0] as User;
  },

  /* ---------- UPDATE USER (PARTIAL UPDATE) ---------- */
  updateUser: async (id: string, data: UpdateUserDTO): Promise<User> => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const pushIfDefined = (field: string, value: unknown) => {
      if (value !== undefined) {
        fields.push(`${field} = ?`);
        values.push(value);
      }
    };

    pushIfDefined("userName", data.userName);
    pushIfDefined("email", data.email);
    pushIfDefined("password", data.password);
    pushIfDefined("role", data.role);
    pushIfDefined("profileImage", data.profileImage);
    pushIfDefined("profileImagePublicId", data.profileImagePublicId);
    pushIfDefined("isEmailVerified", data.isEmailVerified);
    pushIfDefined("tokenHash", data.tokenHash);
    pushIfDefined("tokenExpiry", data.tokenExpiry);

    if (fields.length === 0) {
      throw new Error("No fields provided for update");
    }

    const [updateResult] = await pool.query<ResultSetHeader>(
      `
      UPDATE user
      SET ${fields.join(", ")}
      WHERE id = ?
      `,
      [...values, id],
    );

    if (updateResult.affectedRows === 0) {
      throw new Error("User not found");
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM user WHERE id = ?`,
      [id],
    );

    return rows[0] as User;
  },

  /* ---------- DELETE USER ---------- */
  deleteUser: async (id: string): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM user WHERE id = ?`,
      [id],
    );

    return result.affectedRows > 0;
  },

  /* ---------- UPDATE TOKEN (EMAIL VERIFY / RESET) ---------- */
  updateTokenExpiry: async (
    email: string,
    tokenHash: string,
    tokenExpiry: Date,
  ): Promise<User> => {
    const [updateResult] = await pool.query<ResultSetHeader>(
      `
      UPDATE user
      SET tokenHash = ?, tokenExpiry = ?
      WHERE email = ?
      `,
      [tokenHash, tokenExpiry, email],
    );

    if (updateResult.affectedRows === 0) {
      console.log("No user found to update token");
      throw new Error("User not found with given email");
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, userName, email, tokenHash, tokenExpiry
      FROM user
      WHERE email = ?
      `,
      [email],
    );

    return rows[0] as User;
  },

  /* ---------- VERIFY EMAIL TOKEN ---------- */
    verifyEmailToken: async (tokenHash: string): Promise<User> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, userName, email, isEmailVerified, tokenHash, tokenExpiry
      FROM user
      WHERE tokenHash = ?
        AND tokenExpiry > NOW()
      LIMIT 1
      `,
      [tokenHash],
    );

    if (rows.length === 0) {
      console.log("verfication failed error")
      throw new Error("Invalid or expired verification token");
    }

    return rows[0] as User;
  },

  /* ---------- MARK EMAIL AS VERIFIED ---------- */
  markEmailVerified: async (userId?: string): Promise<void> => {
    await pool.query(
      `
      UPDATE user
      SET isEmailVerified = true,
          tokenHash = NULL,
          tokenExpiry = NULL
      WHERE id = ?
      `,
      [userId],
    );
  },
};
