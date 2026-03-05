import dotenv from "dotenv";

dotenv.config();

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  databaseUrl: mustGet("DATABASE_URL"),
  jwt: {
    secret: mustGet("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "8h"
  }
};