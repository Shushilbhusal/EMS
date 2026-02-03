import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  deleteMediaFromCloudinary,
  uploadMedia,
} from "../../config/cloudnary.js";
import { generateVerificationToken } from "../../lib/generateToken.js";
import { mailer } from "../../lib/mailer.js";
import crypto from "crypto";
import { userModel } from "../../models/userModel.js";
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "user did not registered" });
    }

    if (!user.password) {
      return res.status(401).json({ error: "password required" });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
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
    const user = await userModel.getProfileById(userIdString);
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
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser && existingUser.isEmailVerified === true) {
      console.log("ERROR inside email verificaton true")
      return res.status(409).json({ message: "Email already registered" });
      
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isEmailVerified = false;
    const newUser = await userModel.createUser({
      userName,
      email,
      password: hashedPassword,
      isEmailVerified,
    });
    const { rawToken, tokenHash } = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await userModel.updateTokenExpiry(email, tokenHash, tokenExpiry);
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

    try {
      await mailer.sendMail({
        from: `"Employee System" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify your email",
        html: `
      <h2>Email Verification</h2>
      <p>Click the link below:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
      });
    } catch (mailError) {
      console.log("email error", mailError)
      console.error("Email send failed:", mailError);
    }

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

  const storedToken = await userModel.verifyEmailToken(tokenHash);

  if (!storedToken) {
    return res.status(400).json({ message: "Token expired or invalid" });
  }

  await userModel.markEmailVerified(storedToken.id);

  res.status(200).json({ message: "Email verified successfully" });
};

// edit profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userName, email, password, role } = req.body;
    const profileImagePath = req.file?.path;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "User id not provided",
      });
    }

    //  Find user by ID
    const user = await userModel.getProfileById(id);

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
    const updatedProfile = await userModel.updateUser(id, {
      userName: userName ?? user.userName,
      email: email ?? user.email,
      role: role ?? user.role,
      password: password ?? user.password,
      profileImage: newProfileImage ?? undefined,
      profileImagePublicId: newProfileImagePublicId ?? undefined,
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
