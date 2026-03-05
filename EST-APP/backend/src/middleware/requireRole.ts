import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "./auth.js";
import type { UserRole } from "../types.js";

export function requireRole(...roles: UserRole[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}