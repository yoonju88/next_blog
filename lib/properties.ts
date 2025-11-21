import { firestore } from "@/firebase/server";
import type { CreateProperty, Property } from "../types/property"

export const getPropertyById = async (id: string) => {
    const propertySnapshot = await firestore
        .collection("properties")
        .doc(id)
        .get();

    if (!propertySnapshot.exists) {
        return null
    }

    const data = propertySnapshot.data();
    const propertyData = {
        id: propertySnapshot.id,
        ...data,
        created: data?.created?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated: data?.updated?.toDate?.()?.toISOString() || new Date().toISOString(),
        saleStartDate: data?.saleStartDate?.toDate?.()?.toISOString() || null,
        saleEndDate: data?.saleEndDate?.toDate?.()?.toISOString() || null,
    } as Property

    return propertyData
}

export const getPropertiesById = async (propertyIds: string[]) => {
    if (!propertyIds || propertyIds.length === 0) {
        return []
    }
    const propertiesSnapshot = await firestore
        .collection('properties')
        .where("__name__", "in", propertyIds)
        .get();

    const propertiesData = propertiesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            created: data?.created?.toDate?.()?.toISOString() || new Date().toISOString(),
            updated: data?.updated?.toDate?.()?.toISOString() || new Date().toISOString(),
            saleStartDate: data?.saleStartDate?.toDate?.()?.toISOString() || null,
            saleEndDate: data?.saleEndDate?.toDate?.()?.toISOString() || null,
        } as Property
    });

    return propertiesData
}

export const getRecentProperties = async (): Promise<Property[]> => {
    const sanpshot = await firestore
        .collection('properties')
        .orderBy("created", "desc")
        .limit(4)
        .get()

    const recentProperties = sanpshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            created: data.created?.toDate?.()?.toISOString() || new Date().toISOString(),
            updated: data.updated?.toDate?.()?.toISOString() || new Date().toISOString(),
            saleStartDate: data?.saleStartDate?.toDate?.()?.toISOString() || null,
            saleEndDate: data?.saleEndDate?.toDate?.()?.toISOString() || null,
        } as Property;
    });

    return recentProperties;
}

export const addOrUpdateProperty = async (property: any) => {
    const now = new Date(); // 현재 시각
    const docRef = firestore.collection('properties').doc(property.id);

    await docRef.set(
        {
            ...property,
            updated: now, // 🔹 반드시 현재 시각으로 세팅
            created: property.created || now,
        },
        { merge: true } // 기존 필드 유지
    );
};


export const getOnSaleProperties = async (): Promise<Property[]> => {
    const snapshot = await firestore
        .collection('properties')
        .orderBy("updated", "desc")
        .limit(20)
        .get()

    const now = new Date()

    const activeSaleItems = snapshot.docs
        .map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                created: data.created?.toDate?.()?.toISOString() || new Date().toISOString(),
                updated: data.updated?.toDate?.()?.toISOString() || new Date().toISOString(),
                saleStartDate: data?.saleStartDate?.toDate?.()?.toISOString() || null,
                saleEndDate: data?.saleEndDate?.toDate?.()?.toISOString() || null,
            } as Property;
        })
        .filter(property => {
            if (!property.onSale) {
                return false
            }
            const startDate = property.saleStartDate ? new Date(property.saleStartDate) : null
            const endDate = property.saleEndDate ? new Date(property.saleEndDate) : null
            // 세일 기간 필터 유지
            if (startDate && startDate > now) return false
            if (endDate && endDate < now) return false
            return true
        })
        .sort((a, b) => {
            const aUpdated = a.updated ? new Date(a.updated).getTime() : 0
            const bUpdated = b.updated ? new Date(b.updated).getTime() : 0
            return bUpdated - aUpdated
        })

    return activeSaleItems;
}
