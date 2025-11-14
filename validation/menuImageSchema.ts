import { z } from "zod"

export const menuImageSchema = z.object({
    menuImage: z.object({
        id: z.string().min(1).optional(),
        url: z.string().url("Must be a valid URL").or(z.literal('')),
        alt: z.string().min(3, "Alt text must be at least 3 characters."),
        path: z.string().optional(),
        file: z
            .instanceof(File)
            .optional()
            .refine(
                (file) => !file || file.size <= 5 * 1024 * 1024,
                { message: "Menu image must be 5MB or less." }
            ),
    })
})