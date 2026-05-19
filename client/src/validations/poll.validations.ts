import z from "zod";

export const createPollSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),

    description: z.string(),

    nominees: z
        .array(
            z.object({
                value: z.string().trim().min(1, "Nominee name is required"),
            }),
        )
        .min(2, "Minimum 2 nominees required")
        .max(5, "Maximum 5 nominees allowed"),
});

export type CreatePollFormData = z.infer<typeof createPollSchema>;