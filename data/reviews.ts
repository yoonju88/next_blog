import { auth, firestore } from "@/firebase/server"
import "server-only"
import { cookies } from "next/headers";
import admin from "firebase-admin";

type Reviews = {
    id: string;
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
        const reviewData = doc.data() as Omit<Reviews, 'id'>
        return {
            id: doc.id,
            ...reviewData,
        }
    })
    console.log(reviews)
    return reviews
}