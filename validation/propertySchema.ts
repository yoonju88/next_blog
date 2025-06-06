import { z } from "zod"

export const propertyDataSchema = z.object({
    name: z.string().min(2, "Name must contain a value"),
    subTitle: z.string().min(2, "subTitle must contain a value"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    costPrice: z.coerce.number().positive("Cost price must be greater than 0"),
    category: z.enum(["Make Up", "Skin Care", "Sun Care"]),
    subCategory: z.string().min(2, "Sub category must contain a value"),
    origin: z.string().min(2, "Origin must contain a value"),
    manufacturer: z.string().min(2, "Manufacturer must contain a value"),
    volume: z.coerce.number().min(0, "Volume must be greater than 0"),
    description: z.string().min(4, "Description must contain a value"),
    status: z.enum(["Available", "Sold Out", "Limited edition"]),
    brand: z.string().min(2, "Brand must contain a value"),
    ingredients: z.string().min(4, "Ingredients must contain a value"),
    skinType: z.enum(["Oily Skin", "Dry Skin", "Combination Skin", "Sensitive Skin", "Normal Skin", "All Skin"]),
    skinBenefit: z.string().min(2, "Skin benefit must contain a value"),
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