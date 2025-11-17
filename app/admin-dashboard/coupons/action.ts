'use server'
import { auth } from '@/firebase/server'
import { firestore } from '@/firebase/server'
import {
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore'
import { Coupon, CreateCouponData } from '@/types/coupon'


export async function createCoupon(data: CreateCouponData, token: string): Promise<void> {
    const decoded = await auth.verifyIdToken(token)
    if (!decoded.admin) throw new Error('Unauthorized')

    const id = crypto.randomUUID()
    const ref = firestore.collection("coupons").doc(id)
    await ref.set({
        ...data,
        code: data.code.toUpperCase(),
        usedCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    })
}

export async function updateCoupon(id: string, data: Partial<CreateCouponData>, token: string): Promise<void> {
    const decoded = await auth.verifyIdToken(token)
    if (!decoded.admin) throw new Error('Unauthorized')

    const cleaned = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
    const ref = firestore.collection("coupons").doc(id)
    await ref.update({
        ...cleaned,
        code: typeof cleaned.code === "string" ? cleaned.code.toUpperCase() : cleaned.code,
        updatedAt: new Date(),
    })
}

export async function deleteCoupon(id: string, token: string): Promise<void> {
    const decoded = await auth.verifyIdToken(token)
    if (!decoded.admin) throw new Error('Unauthorized')
    const ref = firestore.collection("coupons").doc(id)
    await ref.delete()
}

export async function getCouponByCode(code: string, token: string): Promise<Coupon | null> {
    const decoded = await auth.verifyIdToken(token)
    if (!decoded.admin) throw new Error('Unauthorized')

    const snapshot = await firestore
        .collection("coupons")
        .where('code', '==', code.toUpperCase())
        .get()

    if (snapshot.empty) return null

    const docSnap = snapshot.docs[0]
    const data = docSnap.data()

    return {
        id: docSnap.id,
        ...data,
        validFrom: data.validFrom?.toDate?.() ?? null,
        validUntil: data.validUntil?.toDate?.() ?? null,
        createdAt: data.createdAt?.toDate?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.() ?? null,
    } as Coupon
}
