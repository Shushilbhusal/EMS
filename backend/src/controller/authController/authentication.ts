import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../lib/db.js";
import {
  deleteMediaFromCloudinary,
  uploadMedia,
} from "../../config/cloudnary.js";
import { generateVerificationToken } from "../../lib/generateToken.js";
import { mailer } from "../../lib/mailer.js";
import crypto from "crypto";
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.Role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};

// get profile of logged in user
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userIdString = String(userId);
    const user = await prisma.user.findUnique({
      where: { id: userIdString },
      select: { id: true, email: true, userName: true, Role: true, profileImage: true },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// create new user (for testing purposes)
export const register = async (req: Request, res: Response) => {
  const { email, password, userName } = req.body;
  try {
    // check if user already exist
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && existingUser.isEmailVerified === true) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        userName,
        password: hashedPassword,
        isEmailVerified: false,
      },
    });
    const { rawToken, tokenHash } = generateVerificationToken();
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        tokenExpiry: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        tokenHash: tokenHash,
      },
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

    await mailer.sendMail({
      from: `"Employee System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
    });

    res.status(201).json({
      message: "User registered click Link in gmail to verify email",
      userId: newUser.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

/////////////// verify email /////////////////////////////////////////////////////////////

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const storedToken = await prisma.user.findFirst({
    where: {
      tokenHash,
      tokenExpiry: { gt: new Date() },
    },
  });

  if (!storedToken) {
    return res.status(400).json({ message: "Token expired or invalid" });
  }

  await prisma.user.update({
    where: { id: storedToken.id },
    data: { isEmailVerified: true, tokenExpiry: null, tokenHash: null },
  });

  res.status(200).json({ message: "Email verified successfully" });
};

// edit profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userName, email, password, role } = req.body;
    const profileImagePath = req.file?.path;
    console.log(profileImagePath)
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "User id not provided",
      });
    }

    //  Find user by ID
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash password if provided
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    //  Handle profile image upload
    let newProfileImage = user.profileImage;
    let newProfileImagePublicId = user.profileImagePublicId;

    if (profileImagePath) {
      // Delete old image from Cloudinary
      if (user.profileImagePublicId) {
        try {
          await deleteMediaFromCloudinary(user.profileImagePublicId);
        } catch (err) {
          console.warn("Failed to delete old Cloudinary image:", err);
        }
      }

      // Upload new image
      const cloudResponse = await uploadMedia(profileImagePath);

      if (!cloudResponse?.secure_url || !cloudResponse?.public_id) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload profile image",
        });
      }

      newProfileImage = cloudResponse.secure_url;
      newProfileImagePublicId = cloudResponse.public_id;
    }

    // Update user
    const updatedProfile = await prisma.user.update({
      where: { id },
      data: {
        userName: userName ?? user.userName,
        email: email ?? user.email,
        Role: role ?? user.Role,
        password: hashedPassword,
        profileImage: newProfileImage,
        profileImagePublicId: newProfileImagePublicId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
