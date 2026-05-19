import { z } from "zod";

export const createPollSchema =
    z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required"),

        description: z
            .string()
            .trim()
            .default(""),

        createdBy: z
            .string()
            .trim()
            .min(1, "CreatedBy is required"),

        nominees: z
            .array(
                z.string().trim()
            )
            .min(
                2,
                "Minimum 2 nominees required"
            )
            .max(
                5,
                "Maximum 5 nominees allowed"
            ),
    })
        .superRefine(
            (data, ctx) => {
                const validNominees =
                    data.nominees.filter(
                        (nominee) =>
                            nominee.trim() !== ""
                    );

                if (
                    validNominees.length < 2
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode.custom,

                        message:
                            "Minimum 2 valid nominees required",

                        path: ["nominees"],
                    });
                }

                const uniqueNominees =
                    new Set(
                        validNominees.map(
                            (nominee) =>
                                nominee.toLowerCase()
                        )
                    );

                if (
                    uniqueNominees.size !==
                    validNominees.length
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode.custom,

                        message:
                            "Duplicate nominees are not allowed",

                        path: ["nominees"],
                    });
                }
            }
        );

export type CreatePollInput = z.infer<typeof createPollSchema>;