'use server'
import { auth, firestore } from "@/firebase/server"
import { bannerImageSchema } from "@/validation/bannerSchema"
import admin from "firebase-admin"
import { z } from "zod"
import { extractStoragePath } from "@/utils/extractStoragePath";

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
            created: data.created?.toMillis() ?? null,
            updated: data.updated?.toMillis() ?? null
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
            created: data.created?.toMillis() ?? null,
            updated: data.updated?.toMillis() ?? null
        }
    })
    return mobileBanners;
}


export const getAllBanners = async (authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if (!verifiedToken.admin) {
        return {
            error: true,
            message: 'Unauthorized'
        }
    }

    const snapshot = await firestore.collection('banners').get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id, // 👉 이게 bannerId!
            webImages: data.webImages || [],
            mobileImages: data.mobileImages || [],
            createdAt: data.createdAt?.toMillis() ?? null,
        };
    });
};

export const getBannerById = async (bannerId: string) => {
    const getDoc = firestore.collection("banners").doc(bannerId)
    const bannerIdSnapshot = await getDoc.get()
    if (!bannerIdSnapshot.exists) throw new Error("No banner")

    const data = bannerIdSnapshot.data()
    return { id: bannerIdSnapshot.id, ...bannerIdSnapshot.data() };
}

export const deleteBannerImages = async (
    { bannerId }: { bannerId: string },
    authToken: string
) => {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if (!verifiedToken.admin) {
        return {
            error: true,
            message: 'Unauthorized'
        }
    }
    // const bannerDoc = firestore.collection("banners").doc(bannerId)
    // const snapshot = await bannerDoc.get()
    // const data = snapshot.data()
    // const allImages = [...(data.webImages || []), ...(data.mobileImages || [])]

    // await Promise.all(
    //     allImages.map(async (image: any) => {
    //         const url = typeof image === "string" ? image : image.url;
    //         const path = extractStoragePath(url);
    //         //await deleteObject(ref(storage, path));
    //     })
    // )

    // await bannerDoc.update({
    //     webImages: [],
    //     mobileImages: [],
    //     updated: new Date()
    // })
    // return { success: true }

    await firestore
        .collection('banners')
        .doc(bannerId)
        .delete()
}