import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().positive(),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
