'use server'
import { auth, firestore } from "@/firebase/server"
import { bannerImageSchema } from "@/validation/bannerSchema"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
    webImages,
    mobileImages
}: {
    bannerId: string
    webImages: z.infer<typeof bannerImageSchema>["webImages"];
    mobileImages: z.infer<typeof bannerImageSchema>["mobileImages"]
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
        bannerId: z.string(),
        webImages: bannerImageSchema.shape.webImages,
        mobileImages: bannerImageSchema.shape.mobileImages,
    })

    const validation = schema.safeParse({ bannerId, webImages, mobileImages })
    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occurred",
        }
    }

    await firestore.collection("banners").doc(bannerId).update({
        webImages,
        mobileImages,
        updated: new Date(),
    });
}

export const getWebBanners = async () => {
    const bannersSnapshot = await firestore
        .collection("banners")
        .get()

    if (bannersSnapshot.empty) { return [] }

    const webBanners = bannersSnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
            id: doc.id,
            images: data.webImages || [],
            created: data.created,
            updated: data.updated
        }
    })
    return webBanners;
}

export const getMobileBanners = async () => {
    const bannersSnapshot = await firestore
        .collection("banners")
        .get()

    if (bannersSnapshot.empty) { return [] }

    const mobileBanners = bannersSnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
            id: doc.id,
            images: data.mobileImages || [],
            created: data.created,
            updated: data.updated
        }
    })
    return mobileBanners;
}

/*
export const getAllBanners = async () => {
    const bannersSnapshot = await firestore
        .collection("banners")
        .get()

    if (bannersSnapshot.empty) { return { webImages: [], mobileImages: [] } }

    const banners = bannersSnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
            id: doc.id,
            webImages: data.webImages || [],
            mobileImages: data.mobileImages || [],
            created: data.created,
            updated: data.updated
        }
    })
    return banners;
}
    */