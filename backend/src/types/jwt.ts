// export interface UserPayload {
//   id: number;
//   role: "user" | "owner";
// }

/**
 * Previously, we had defined the shape of 'UserPayload' as above. But, the issue with it was, we had to use 'as' to let compiler understand our payload in files like 'auth.ts' and 'verifyToken.ts'.
 * Although it worked, but as 'as' is compiler only check, there was risk of silent bugs (like: if actual decoded payload shape diverged) passing in which could crash the app in runtime even though compile looked fine.
 * Therefore, we are using 'zod' to define the schema of payload and validate the payload in the runtime.
 */
import { z } from "zod";

export const userPayloadSchema = z.object({
  id: z.number(),
  role: z.enum(["user", "owner"]),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;
