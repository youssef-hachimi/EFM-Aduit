import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { JwtPayload } from "../types.js";

export type AuthedRequest = Request & { user?: JwtPayload };

export function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}