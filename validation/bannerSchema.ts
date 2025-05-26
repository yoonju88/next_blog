import { z } from "zod"

export const bannerImageSchema = z.object({
    webImages: z.array(
        z.object({
            id: z.string(),
            url: z.string(),
            file: z
                .instanceof(File)
                .optional()
                .refine(
                    (file) => !file || file.size <= 5 * 1024 * 1024,
                    { message: "Each web images must be 5MB or less." }
                ),
        })
    )
        .max(5, { message: "You can upload up to 5 images" }),

    mobileImages: z.array(
        z.object({
            id: z.string(),
            url: z.string(),
            file: z
                .instanceof(File)
                .optional()
                .refine(
                    (file) => !file || file.size <= 3 * 1024 * 1024,
                    { message: "Each mobile images must be 3MB or less." }
                )
        })
    )
        .max(5, { message: "You can upload up to 5 images" }),
})