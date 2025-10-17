"use server"
import { auth, firestore } from "@/firebase/server"
import { FieldValue } from "firebase-admin/firestore"
import { z } from "zod"


export const addFavourite = async (propertyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken) {
        return { ok: false, message: "Unauthorized" }
    }

    await firestore
        .collection("favourites")
        .doc(verifiedToken.uid)
        .set(
            {
                [propertyId]: true
            },
            {
                merge: true
            }
        )
    return { ok: true }
}

export const removefavourite = async (propertyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken) {
        return { ok: false, message: "Unauthorized" }
    }
    await firestore
        .collection("favourites")
        .doc(verifiedToken.uid)
        .update({
            [propertyId]: FieldValue.delete(),
        });
    return { ok: true }
}
