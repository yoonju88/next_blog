"use server"

import { auth, firestore } from "@/firebase/server";
import { z } from "zod"
import { FieldValue } from "firebase-admin/firestore"

export const savePropertyImages = async ({
    propertyId,
    images,
}: {
    propertyId: string
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

    const validation = schema.safeParse({ propertyId, images })
    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occurred",
        }
    }

    await firestore.collection("properties").doc(propertyId).update({
        images,
    })
}

export async function updateSaleAction({
    selectedIds,
    salePrice,
    saleRate,
    saleStartDate,
    saleEndDate
}: {
    selectedIds: string[]
    salePrice?: number
    saleRate?: number
    saleStartDate?: string
    saleEndDate?: string
},
    authToken: string
) {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if (!verifiedToken.admin) {
        return {
            error: true,
            message: 'Unauthorized'
        }
    }
    const batch = firestore.batch();

    for (const id of selectedIds) {
        const ref = firestore.doc(`properties/${id}`)
        const docSnap = await ref.get()
        const data = docSnap.data()
        const originalPrice = data?.price

        if (!originalPrice || isNaN(Number(originalPrice))) continue

        // 🔽 타입 강제 변환
        const numericSalePrice = Number(salePrice)
        const numericSaleRate = Number(saleRate)

        let calculatedSalePrice: number | undefined = undefined

        if (!isNaN(numericSalePrice) && numericSalePrice > 0) {
            // 고정 금액 할인: 예) 30000 - 5000 = 25000
            calculatedSalePrice = originalPrice - numericSalePrice
        } else if (!isNaN(numericSaleRate) && numericSaleRate > 0 && numericSaleRate < 100) {
            // 퍼센트 할인: 예) 30000 * 0.8 = 24000
            calculatedSalePrice = Math.round(originalPrice * (1 - numericSaleRate / 100))
        }

        if (!calculatedSalePrice || isNaN(calculatedSalePrice)) continue

        const updateData: any = {
            onSale: true,
            salePrice: calculatedSalePrice,
        }

        if (!isNaN(numericSaleRate) && numericSaleRate > 0 && numericSaleRate < 100) {
            updateData.saleRate = numericSaleRate
        }

        // ✅ 날짜 필드 추가
        if (saleStartDate) {
            updateData.saleStartDate = new Date(saleStartDate)
        }
        if (saleEndDate) {
            updateData.saleEndDate = new Date(saleEndDate)
        }

        batch.update(ref, updateData)
    }

    await batch.commit();
}

export async function removeSaleAction(selectedIds: string[], authToken: string) {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if (!verifiedToken.admin) {
        return {
            error: true,
            message: 'Unauthorized'
        }
    }
    const batch = firestore.batch()
    selectedIds.forEach(id => {
        const ref = firestore.doc(`properties/${id}`)
        batch.update(ref, {
            onSale: false,
            salePrice: FieldValue.delete(),
            saleRate: FieldValue.delete(),
            saleStartDate: FieldValue.delete(),
            saleEndDate: FieldValue.delete(),
        })
    })
    await batch.commit()
}
