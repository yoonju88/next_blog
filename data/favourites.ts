import { auth, firestore } from "@/firebase/server";
import { cookies } from "next/headers";
import "server-only";

export const getUserFavourites = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;
    if (!token) {
        return { propertyIds: [] }
    };

    const verifiedToken = await auth.verifyIdToken(token);

    if (!verifiedToken) {
        return { propertyIds: [] }
    }

    const favouritesSnapshot = await firestore
        .collection("favourites")
        .doc(verifiedToken.uid)
        .get()

    if (!favouritesSnapshot.exists) {
        // 문서가 없을 때 기본값 리턴
        return {
            propertyIds: []
        }
    }

    const favouritesData = favouritesSnapshot.data() || { propertyIds: [] }
    return favouritesData
}