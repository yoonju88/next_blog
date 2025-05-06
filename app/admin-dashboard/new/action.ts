"use server"
import { auth, firestore } from "@/firebase/server"
import { propertyDataSchema } from "@/validation/propertySchema"
import admin from "firebase-admin"

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

export const createProperty = async (
    data: {
        name: string;
        price: number;
        category: string;
        origin: string;
        manufacturer?: string;
        volume: number;
        description: string;
        status: "Available" | "Sold Out" | "Limited edition";
        ingredients?: string;
        keyIngredients?: string;
        skinType: "Oily Skin" | "Dry Skin" | "Combination Skin" | "Sensitive Skin" | "Normal Skin";
        howToUse: string;
        expireDate: string;
        stockQuantity: number;
    },
    authToken: string,
) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken.admin) {
        return {
            error: true,
            message: "Unauthorized"
        }
    }

    const validation = propertyDataSchema.safeParse(data)
    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occured"
        }
    }
    const property = await firestore.collection("properties").add({
        ...data,
        created: new Date(),
        updated: new Date()
    })
    return {

        propertyId: property.id
    }
}