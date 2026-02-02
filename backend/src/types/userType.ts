export type UserRole = "ADMIN" | "USER";

export interface User {
  id?: string;
  userName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  profileImage?: string | null;
  profileImagePublicId?: string | null;
  isEmailVerified?: boolean;
  tokenHash?: string | null;
  tokenExpiry?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface Employee {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  salary?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

