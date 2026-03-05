export type UserRole = "ADMIN" | "TEACHER";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type JwtPayload = {
  sub: string; // user id
  role: UserRole;
  name: string;
  email: string;
};