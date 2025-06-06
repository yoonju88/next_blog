import { z } from "zod"

export const propertyDataSchema = z.object({
    name: z.string().min(2, "Name must contain a value").default(""),
    subTitle: z.string().min(2, "subTitle must contain a value").default(""),
    price: z.coerce.number().positive("Price must be greater than 0").default(0),
    costPrice: z.coerce.number().positive("Cost price must be greater than 0").default(0),
    category: z.enum(["Make Up", "Skin Care", "Sun Care"]).default("Make Up"),
    subCategory: z.string().min(2, "Sub category must contain a value").default(""),
    origin: z.string().min(2, "Origin must contain a value").default("Korea"),
    manufacturer: z.string().min(2, "Manufacturer must contain a value").default(""),
    volume: z.coerce.number().min(0, "Volume must be greater than 0").default(0),
    description: z.string().min(4, "Description must contain a value").default(""),
    status: z.enum(["Available", "Sold Out", "Limited edition"]).default("Available"),
    brand: z.string().min(2, "Brand must contain a value").default(""),
    ingredients: z.string().min(4, "Ingredients must contain a value").default(""),
    skinType: z.enum(["Oily Skin", "Dry Skin", "Combination Skin", "Sensitive Skin", "Normal Skin", "All Skin"]).default("All Skin"),
    skinBenefit: z.string().min(2, "Skin benefit must contain a value").default(""),
    howToUse: z.string().min(2, "How to use must contain a value").default(""),
    expireDate: z.string().min(2, "expire date must contain a value").default(""),
    stockQuantity: z.coerce.number().int()
        .min(0, "stock quantity must greater than 0")
        .max(200, "stock quantity must less than 200")
        .default(0)
})

export const propertyImageSchema = z.object({
    images: z.array(
        z.object({
            id: z.string(),
            url: z.string(),
            file: z.instanceof(File).optional(),
        })
    ).default([]),
})

export const propertySchema = propertyDataSchema.and(propertyImageSchema) 