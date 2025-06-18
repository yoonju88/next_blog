import { db } from '@/firebase/client'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    increment,
    query,
    where,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore'
import { Coupon } from '@/types/coupon'

const COUPONS_COLLECTION = 'coupons'

export async function getAllCoupons(): Promise<Coupon[]> {
    const q = query(
        collection(db, COUPONS_COLLECTION),
        orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        validFrom: doc.data().validFrom?.toDate(),
        validUntil: doc.data().validUntil?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
    })) as Coupon[]
}

export async function getActiveCoupons(): Promise<Coupon[]> {
    const now = new Date()
    const q = query(
        collection(db, COUPONS_COLLECTION),
        where('isActive', '==', true),
        where('validFrom', '<=', now),
        where('validUntil', '>=', now),
        orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        validFrom: doc.data().validFrom?.toDate(),
        validUntil: doc.data().validUntil?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
    })) as Coupon[]
}

export async function getCouponById(id: string): Promise<Coupon | null> {
    const ref = doc(db, COUPONS_COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    const data = snap.data()
    return {
        id: snap.id,
        ...data,
        validFrom: data.validFrom?.toDate(),
        validUntil: data.validUntil?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as Coupon
}

export async function incrementCouponUsage(id: string): Promise<void> {
    const ref = doc(db, COUPONS_COLLECTION, id)
    await updateDoc(ref, {
        usedCount: increment(1),
        updatedAt: serverTimestamp(),
    })
}

export function validateCoupon(coupon: Coupon, totalAmount: number): { isValid: boolean; message: string } {
    const now = new Date()
    if (!coupon.isActive) return { isValid: false, message: 'This coupon is inactive' }
    if (now < coupon.validFrom || now > coupon.validUntil) return { isValid: false, message: 'This coupon is expired or not yet valid' }
    if (coupon.usedCount >= coupon.usageLimit) return { isValid: false, message: 'This coupon has reached its usage limit' }
    if (coupon.minAmount && totalAmount < coupon.minAmount) return { isValid: false, message: `Minimum order amount is €${coupon.minAmount}` }
    return { isValid: true, message: 'Coupon is valid' }
}

export function calculateDiscount(coupon: Coupon, totalAmount: number): number {
    let discount = 0
    if (coupon.type === 'fixed') {
        discount = coupon.discount
    } else {
        discount = (totalAmount * coupon.discount) / 100
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
    }
    return Math.min(discount, totalAmount)
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
    const q = query(
        collection(db, COUPONS_COLLECTION),
        where('code', '==', code.toUpperCase())
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null

    const docSnap = snapshot.docs[0]
    const data = docSnap.data()

    return {
        id: docSnap.id,
        ...data,
        validFrom: data.validFrom?.toDate(),
        validUntil: data.validUntil?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as Coupon
}