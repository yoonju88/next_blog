'use server'
import { auth, firestore } from "@/firebase/server"
import { bannerImageSchema } from "@/validation/bannerSchema"
import admin from "firebase-admin"
import { z } from "zod"
import type { HomeBannerImage } from "@/types/banner"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

    revalidatePath('/admin-dashboard/banners')
    redirect('/admin-dashboard/banners')
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

    revalidatePath('/admin/banners')
    revalidatePath('/')

    return { success: true }
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

type StoredBannerImage = {
    id?: string;
    url?: string;
    alt?: string;
    path?: string;
}

export const getBannerById = async (bannerId: string): Promise<HomeBannerImage> => {
    const getDoc = firestore.collection("banners").doc(bannerId)
    const bannerIdSnapshot = await getDoc.get()
    if (!bannerIdSnapshot.exists) throw new Error("No banner")

    const data = bannerIdSnapshot.data() ?? {}

    const normalizeImages = (images: unknown): HomeBannerImage["webImages"] =>
        Array.isArray(images)
            ? images
                .filter((image): image is StoredBannerImage => typeof image === "object" && image !== null)
                .map((image, index) => ({
                    id: image.id ?? `${bannerId}-image-${index}`,
                    url: image.url ?? "",
                    alt: image.alt,
                    path: image.path,
                }))
                .filter((image) => Boolean(image.url))
            : []

    return {
        id: bannerIdSnapshot.id,
        webImages: normalizeImages(data.webImages),
        mobileImages: normalizeImages(data.mobileImages),
        created: data.created?.toMillis?.() ?? null,
        updated: data.updated?.toMillis?.() ?? null,
    };
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

    revalidatePath('/admin-dashboard/banners/')
    redirect('/admin-dashboard/banners')

    return { success: true }
}