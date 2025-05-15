"use server"
import { auth, firestore } from "@/firebase/server"
import { FieldValue } from "firebase-admin/firestore"

export const addFavourite = async (proeprtyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken) {
        return {
            error: true,
            message: "Unauthorized"
        }
    }

    await firestore
        .collection("favourites")
        .doc(verifiedToken.uid)
        .set(
            {
                [proeprtyId]: true
            },
            {
                merge: true
            }
        )
}

export const removefavourite = async (propertyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken) {
        return {
            error: true,
            message: "Unauthorized"
        }
    }
    await firestore
        .collection("favourites")
        .doc(verifiedToken.uid)
        .update({
            [propertyId]: FieldValue.delete(),
        });
}