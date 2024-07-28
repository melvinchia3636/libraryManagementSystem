// server/src/routes/userRoutes.ts

import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const router = express.Router();
const prisma = new PrismaClient();

// Zod Schemas for Validation
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// REGISTER (POST /auth/register)
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = registerSchema.parse(
      req.body
    );

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors }); // Validation error
    } else if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "Email already in use." }); // Duplicate email
      } else {
        res.status(500).json({ error: "Database error." }); // Other Prisma errors
      }
    } else {
      res.status(500).json({ error: "Failed to register user." }); // General error
    }
  }
});

// LOGIN (POST /auth/login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    console.log(await prisma.user.findMany());
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate JWT token (replace 'YOUR_JWT_SECRET' with your actual secret)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Failed to login." });
    }
  }
});

export default router;
