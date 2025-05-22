import z from 'zod'

export const reviewDataSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(5).max(1000),
})

export const reviewImageSchema = z.object({
    images: z.array(
        z.object({
            id: z.string(),
            url: z.string(),
            file: z.instanceof(File).optional(),
        })
    ),
})

export const reviewSchema = reviewDataSchema.and(reviewImageSchema) 