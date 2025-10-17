"use server"
import { auth, firestore } from "@/firebase/server"
import admin from "firebase-admin";
import { z } from "zod"

export const createReview = async (
    propertyId: string,
    authToken: string,
    reviewData: {
        rating: number;
        comment: string;
        userId: string;
        userName: string;
        userPhotoURL?: string;
    }) => {
    const verifiedToken = await auth.verifyIdToken(authToken)
    if (!verifiedToken) {
        return {
            error: true,
            message: "Unauthorized, login first to create the review"
        }
    }
    const userId = verifiedToken.uid
    // 1️⃣ propertyId 기반으로 프로퍼티 이름 조회
    const propertyDoc = await firestore.collection("properties").doc(propertyId).get();
    if (!propertyDoc.exists) {
        return {
            error: true,
            message: "Property not found"
        };
    }
    const propertyData = propertyDoc.data();
    const propertyName = propertyData?.name ?? "Unknown";

    const reviewDoc = {
        userId,
        propertyId,
        propertyName,
        rating: reviewData.rating,
        comment: reviewData.comment,
        userName: reviewData.userName,
        userPhotoURL: reviewData.userPhotoURL ?? "", // 안전하게 처리
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
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

export const deleteReview = async (reviewId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken) {
        return {
            error: true,
            message: "Unauthorized"
        }
    }
    await firestore
        .collection("reviews")
        .doc(reviewId)
        .delete()
}