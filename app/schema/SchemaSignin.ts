import * as zod from "zod"

export const schemaSignin = zod
.object({

    email: zod
        .string()
        .nonempty("Email is required")
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Invalid email format"),

    password: zod
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

    })
    