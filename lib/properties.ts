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

    const propertyData = {
        id: propertySnapshot.id,
        ...propertySnapshot.data(),
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

    const propertiesData = propertiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as Property
    ))

    return propertiesData
}

export const getRecentProperies = async (): Promise<Property[]> => {
    const sanpshot = await firestore
        .collection('properties')
        .orderBy("created", "desc")
        .limit(3)
        .get()

    const recentProperties = sanpshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Property[]

    return recentProperties;
}