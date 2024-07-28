// server/src/middlewares/errorHandler.ts
import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma errors (e.g., unique constraint violations)
    res.status(400).json({ error: "Database error." });
  } else {
    // Handle other general errors
    res.status(500).json({ error: "Internal server error." });
  }
};

export default errorHandler;
