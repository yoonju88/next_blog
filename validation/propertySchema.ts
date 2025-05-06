import { z } from "zod"

export const propertyDataSchema = z.object({
    name: z.string().min(2, "Name must contain a value"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    category: z.string().min(2, "Category must contain a value"),
    origin: z.string().min(2, "Origin must contain a value"),
    manufacturer: z.string().optional(),
    volume: z.coerce.number().min(0, "Volume must be greater than 0"),
    description: z.string().min(4, "Description must contain a value"),
    status: z.enum(["Available", "Sold Out", "Limited edition"]),
    brand: z.string().min(2, "Brand must contain a value"),
    ingredients: z.string().optional(),
    keyIngredients: z.string().optional(),
    skinType: z.enum(["Oily Skin", "Dry Skin", "Combination Skin", "Sensitive Skin", "Normal Skin"]),
    howToUse: z.string().min(2, "How to use must contain a value"),
    expireDate: z.string().min(2, "expire date must contain a value"),
    stockQuantity: z.coerce.number().int()
        .min(0, "stock quantity must greater than 0")
        .max(200, "stock quantity must less than 200")
})

export const propertyImageSchema = z.object({
    images: z.array(
        z.object({
            id: z.string(),
            url: z.string(),
            file: z.instanceof(File).optional(),
        })
    ),
})

export const propertySchema = propertyDataSchema.and(propertyImageSchema) 