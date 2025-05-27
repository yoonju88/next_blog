'use server'

import { auth, firestore } from "@/firebase/server"
import { bannerImageSchema } from "@/validation/bannerSchema"
import admin from "firebase-admin"
import { z } from "zod"

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

export const createBanner = async (
    data: unknown,
    authToken: string,
) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken.admin) {
        return {
            error: true,
            message: "Unauthorized"
        }
    }

    const validation = bannerImageSchema.safeParse(data)
    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occured"
        }
    }

    const bannerData = validation.data;

    const banner = await firestore.collection("banners").add({
        ...bannerData,
        created: new Date(),
        updated: new Date()
    })
    return {

        bannerId: banner.id
    }
}


export const saveBannerImages = async ({
    bannerId,
    images,
}: {
    bannerId: string
    images: string[]
},
    authToken: string
) => {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if (!verifiedToken.admin) {
        return {
            error: true,
            message: 'Unauthorized'
        }
    }

    const schema = z.object({
        propertyId: z.string(),
        images: z.array(z.string()),
    })

    const validation = schema.safeParse({ bannerId, images })
    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occurred",
        }
    }

    await firestore.collection("banners").doc(bannerId).update({
        images,
    })
}
