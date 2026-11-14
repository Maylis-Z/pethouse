import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);

// Protected test route: works with our JWT or a Google OAuth2 token
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Access granted",
    user: req.user,
  });
});

export default router;