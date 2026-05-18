import dotenv from "dotenv";
dotenv.config();


import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),

    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

    JWT_SECRET: z
        .string()
        .min(6, "JWT_SECRET must be at least 6 characters"),

    SESSION_SECRET: z
        .string()
        .min(6, "SESSION_SECRET must be at least 6 characters"),

    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        "Invalid environment variables"
    );

    console.dir(
        z.treeifyError(parsedEnv.error),
        {
            depth: null,
        }
    );

    process.exit(1);
}

export const env = parsedEnv.data;