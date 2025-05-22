import { auth, firestore, getTotalPages } from "@/firebase/server"
import "server-only"
import { cookies } from "next/headers";

type Reviews = {
    id: string;
    images?: string[];
    comment?: string;
    rating?: number;
    updatedAt?: FirebaseFirestore.Timestamp;
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

    const reviews = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Reviews, 'id'>)
    }))

    return reviews
}