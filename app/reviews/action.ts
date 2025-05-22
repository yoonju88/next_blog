"use server"
import { auth, firestore } from "@/firebase/server"
import { FieldValue } from "firebase-admin/firestore"
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { z } from "zod"


export const createReview = async (
    propertyId: string,
    authToken: string,
    reviewData: {
        rating: number;
        comment: string;
    }

) => {
    const verifiedToken = await auth.verifyIdToken(authToken)
    if (!verifiedToken) {
        return {
            error: true,
            message: "Unauthorized, login first to create the review"
        }
    }
    const userId = verifiedToken.uid
    const reviewDoc = {
        userId,
        propertyId,
        ...reviewData,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const review = await firestore
        .collection("reviews")
        .add(reviewDoc)

    return {
        reviewId: review.id
    }

}

export const saveReviewImages = async ({
    reviewId,
    images,
}: {
    reviewId: string
    images: string[]
}, authToken: string
) => {
    const verifiedToken = await auth.verifyIdToken(authToken);
    if (!verifiedToken.admin) {
        return {
            error: true,
            message: 'Unauthorized'
        }
    }

    const schema = z.object({
        reviewId: z.string(),
        images: z.array(z.string()),
    })

    const validation = schema.safeParse({ reviewId, images })
    if (!validation.success) {
        return {
            error: true,
            _message: validation.error.issues[0]?.message ?? "An error occured."
        }
    }
    await firestore
        .collection("reviews")
        .doc(reviewId)
        .update({
            images,
            updatedAt: new Date(),
        })
}