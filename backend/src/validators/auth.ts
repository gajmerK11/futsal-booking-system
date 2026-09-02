import z from "zod";

const registerSchema = z
  .object({
    username: z.string(),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    phone_number: z.string().regex(/^9\d{9}$/),
    role: z.enum(["user", "owner"]),
    location: z.string().min(1),
    lat: z.coerce.number().min(-90).max(90),
    lon: z.coerce.number().min(-180).max(180),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match", // error message shown on failure of condition
    path: ["confirmPassword"], // which field the error attaches to
  });
