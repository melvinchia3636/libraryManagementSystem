import { Request, Response, NextFunction } from "express";
import jwt from "express-jwt";

const authenticate = jwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
});
export default authenticate;
