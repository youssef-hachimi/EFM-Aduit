import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { classesRouter } from "./routes/classes.routes.js";
import { studentsRouter } from "./routes/students.routes.ts";
import { enrollmentsRouter } from "./routes/enrollments.routes.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { reportsRouter } from "./routes/reports.routes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);
app.use("/api/students", studentsRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/reports", reportsRouter);

app.use(errorHandler);