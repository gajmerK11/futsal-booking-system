import z from "zod";

const registerSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  phoneNumber: z.string().regex(/^9\d{9}$/),
  role: z.enum(["user", "owner"]),
  location: z.string().min(1),
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});
