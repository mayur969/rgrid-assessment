import { z } from "zod";

export const votePollSchema =
    z.object({
        pollId: z
            .string()
            .trim()
            .min(1, "Poll ID is required"),

        nomineeId: z
            .string()
            .trim()
            .min(
                1,
                "Nominee ID is required"
            ),
    });
