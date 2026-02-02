import { Router } from "express";
import { getProfile, login, logout, register, updateProfile, verifyEmail } from "../controllers/authController/authentication.js";
import { isLoggedIn } from "../middleware/authentication.js";
import { handleFileUpload } from "../config/multer.js";

const authRouter = Router();
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/register", register);
authRouter.get("/profile", isLoggedIn, getProfile);
authRouter.get("/verify-email", verifyEmail);
authRouter.patch("/updateProfile/:id", isLoggedIn, handleFileUpload('profileImage'), updateProfile);

export default authRouter;