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
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{6,}$/,
    // "Password must contain uppercase, lowercase, number and a special character")
    })
    