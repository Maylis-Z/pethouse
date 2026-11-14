import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized, token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  // 1) Try our own JWT (from /api/auth/login)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      req.user = user;
      return next();
    }
  } catch (error) {
    // not one of our JWTs, so try Google next
  }

  // 2) Try a Google OAuth2 access token
  try {
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.ok) {
      const profile = await response.json();
      req.user = {
        name: profile.name,
        email: profile.email,
        provider: "google",
      };
      return next();
    }
  } catch (error) {
    // network problem: fall through to the 401 below
  }

  return res.status(401).json({
    message: "Not authorized, invalid token",
  });
};

export default protect;