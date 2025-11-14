'use server'
import { auth, firestore } from "@/firebase/server"
import admin from "firebase-admin"
import { z } from "zod"
import { menuImageSchema } from "@/validation/menuImageSchema"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

export const createMenuImage = async (
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

    const validation = menuImageSchema.safeParse(data)
    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occured"
        }
    }

    const imageData = validation.data;

    const menuImageDoc = await firestore.collection("menu_image").add({
        ...imageData.menuImage,
        created: new Date(),
        updated: new Date()
    })
    return {
        success: true,
        imageId: menuImageDoc.id,
        imageUrl: imageData.menuImage.url,
        alt: imageData.menuImage.alt,
    }
}

export const updateMenuImage = async ({
    imageId,
    menuImage,
}: {
    imageId: string
    menuImage: z.infer<typeof menuImageSchema>["menuImage"];
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
        imageId: z.string(),
        menuImage: menuImageSchema.shape.menuImage,
    })

    const validation = schema.safeParse({ imageId, menuImage })
    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occurred",
        }
    }

    await firestore.collection("menu_image").doc(imageId).update({
        ...menuImage,
        updated: new Date(),
    });

    return { success: true };
}

export const getMenuImage = async () => {
    const bannersSnapshot = await firestore
        .collection("menu_image")
        .orderBy("created", "desc")
        .limit(1)
        .get()

    if (bannersSnapshot.empty) return null

    const doc = bannersSnapshot.docs[0];
    const data = doc.data();


    return {
        id: doc.id,
        url: data.url,
        alt: data.alt,
        path: data.path,
        created: data.created.toMillis?.() ?? null,
        updated: data.updated.toMillis?.() ?? null,
    }
}

export const deleteMenuImage = async (
    { imageId }: { imageId: string },
    authToken: string
) => {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if (!verifiedToken.admin) {
        return {
            error: true,
            message: 'Unauthorized'
        }
    }
    await firestore
        .collection('menu_image')
        .doc(imageId)
        .delete()
    return { success: true };
}