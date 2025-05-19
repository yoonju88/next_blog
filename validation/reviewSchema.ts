import z from 'zod'

export const ReviewSchema = z.object({
    propertyId: z.string(),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(5).max(1000),
})