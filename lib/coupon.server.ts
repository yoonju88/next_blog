'use server'

import { firestore } from '@/firebase/server'
import { Coupon } from '@/types/coupon'

export async function getActionPromoCoupon(): Promise<Coupon | null> {
    const now = new Date()

    const snapshot = await firestore
        .collection("coupon")
        .where('isActive', '==', true)
        .get()

    if (snapshot.empty) return null

    const validCoupon = snapshot.docs.find(docSnap => {
        const data = docSnap.data()
        const validFrom = data.validFrom.toDate?.() ?? null
        const validUntil = data.validUntil?.toDate?.() ?? null

        if (validFrom && now < validFrom) return false
        if (validUntil && now > validUntil) return false

        return true
    })
    if (!validCoupon) return null

    const data = validCoupon.data()
    return {
        id: validCoupon.id,
        ...data,
        validFrom: data.validFrom?.toDate?.() ?? null,
        validUntil: data.validUntil?.toDate?.() ?? null,
        createdAt: data.createdAt?.toDate?.() ?? null,
        updatedAt: data.updatedAt?.toDate?.() ?? null,
    } as Coupon
}

export async function consumeCouponServer(code: string) {
    const snapshot = await firestore
        .collection("coupons")
        .where("code", "==", code.toUpperCase())
        .get();

    if (snapshot.empty) return;

    const doc = snapshot.docs[0];
    const data = doc.data();

    // 이미 사용된 쿠폰이면 무시
    if (!data.isActive || data.usedCount > 0) return;

    await firestore.collection("coupons").doc(doc.id).update({
        usedCount: 1,
        isActive: false,
        updatedAt: new Date(),
    });
}
