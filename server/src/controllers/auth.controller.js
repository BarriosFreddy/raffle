import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raffle321";

export const authController = {
  login: async (req, res) => {
    try {
      const SECRET_KEY = process.env.SECRET_KEY;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      // Validate password
      if (password !== ADMIN_PASSWORD) {
        logger.warn("Invalid login attempt");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log({
        password,
        adminPassword: ADMIN_PASSWORD,
        SECRET_KEY,
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          role: "admin",
          timestamp: Date.now(),
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      console.log({ token });
      // Send response
      res.status(200).json({
        token,
        user: {
          role: "admin",
        },
      });

      logger.info("Admin logged in successfully");
    } catch (error) {
      logger.error("Error in login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  logout: async (req, res) => {
    try {
      res.status(200).json({ message: "Logged out successfully" });
      logger.info("Admin logged out successfully");
    } catch (error) {
      logger.error("Error in logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Middleware to verify JWT token
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1]; // Bearer <token>
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
      });
    } catch (error) {
      logger.error("Error verifying token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
