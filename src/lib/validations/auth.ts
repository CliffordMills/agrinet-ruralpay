import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain an uppercase letter").regex(/[0-9]/, "Password must contain a number"),
  confirm_password: z.string(),
  role: z.enum(["FARMER", "AGENT", "BUYER", "HUB_MANAGER"]),
  first_name: z.string().min(2, "First name required"),
  last_name: z.string().min(2, "Last name required"),
  phone: z.string().regex(/^(\+233|0)[0-9]{9}$/, "Enter a valid Ghana phone number"),
}).refine((data) => data.password === data.confirm_password, { message: "Passwords do not match", path: ["confirm_password"] });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain an uppercase letter").regex(/[0-9]/, "Password must contain a number"),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, { message: "Passwords do not match", path: ["confirm_password"] });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
