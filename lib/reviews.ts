import { auth, firestore } from "@/firebase/server"
import "server-only"
import { cookies } from "next/headers";
import admin from "firebase-admin";

type Review = {
    id: string;
    propertyId: string;
    images?: string[];
    comment?: string;
    rating?: number;
    userName?: string;
    userPhotoURL?: string | undefined;
    createdAt: admin.firestore.Timestamp,
    updatedAt?: admin.firestore.Timestamp,
}

export const getUserReviews = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;
    if (!token) {
        return []
    };

    const verifiedToken = await auth.verifyIdToken(token);

    if (!verifiedToken) {
        return []
    }

    const userId = verifiedToken.uid;
    const reviewsSnapshot = await firestore
        .collection("reviews")
        .where("userId", "==", userId)
        .orderBy("updatedAt", "desc")
        .get();

    const reviews = reviewsSnapshot.docs.map((doc) => {
        const reviewData = doc.data() as Omit<Review, 'id'>
        return {
            id: doc.id,
            ...reviewData,
        }
    })
    return reviews
}


export const getReviewsByPropertyId = async (propertyId: string): Promise<Review[]> => {
    const reviewsSnapshot = await firestore
        .collection("reviews")
        .where("propertyId", "==", propertyId)
        .orderBy("createdAt", "desc")
        .get();

    const productReviews: Review[] = reviewsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            propertyId: data.propertyId,
            userId: data.userId,
            rating: data.rating,
            comment: data.comment,
            userName: data.userName,
            userPhotoURL: data.userPhotoURL,
            images: data.images,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    })
    return productReviews
}

export const getAverageRating = async (propertyId: string) => {
    const reviewsSnapshopt = await firestore
        .collection("reviews")
        .where("propertyId", "==", propertyId)
        .get()

    const reviews = reviewsSnapshopt.docs.map(doc => doc.data());
    const ratings = reviews.map(r => r.rating).filter(r => typeof r === "number")
    if (ratings.length === 0) return 0;

    const total = ratings.reduce((sum, r) => sum + r, 0)
    const averageRating = total / ratings.length;
    return averageRating
}