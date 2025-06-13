import { firestore, getTotalPages } from "@/firebase/server";
import { Property } from "@/types/property";
import { PropertyStatus } from "@/types/propertyStatus";


type GetPropetyOptions = {
    filters?: {
        minPrice?: number | null;
        maxPrice?: number | null;
        category?: string | null;
        brand?: string | null;
        search?: string;
        date?: string;
    }
    pagination?: {
        pageSize?: number;
        page?: number;
    }
}

export const getProperties = async (options?: GetPropetyOptions) => {
    const page = options?.pagination?.page || 1;
    const pageSize = options?.pagination?.pageSize || 10
    const { minPrice, maxPrice, category, brand } = options?.filters || {};

    let propertiesQuery = firestore.collection("properties").orderBy("updated", "desc")
    if (minPrice !== null && minPrice !== undefined) {
        propertiesQuery = propertiesQuery.where("price", ">=", minPrice);
    }
    if (maxPrice !== null && maxPrice !== undefined) {
        propertiesQuery = propertiesQuery.where("price", "<=", maxPrice);
    }
    if (category) {
        propertiesQuery = propertiesQuery.where("category", "in", category);
    }
    if (brand) {
        propertiesQuery = propertiesQuery.where("brand", "in", brand);
    }

    const totalPages = await getTotalPages(propertiesQuery, pageSize)

    const propertiesSnapshot = await propertiesQuery
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .get()

    if (propertiesSnapshot.empty) {
        const fallbackQuery = firestore.collection("properties").orderBy("updated", "desc");
        const fallbackSnapshot = await fallbackQuery
            .limit(pageSize)
            .offset((page - 1) * pageSize)
            .get();

        const properties = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Property));

        const fallbackTotalPages = await getTotalPages(fallbackQuery, pageSize);

        return { data: properties, totalPages: fallbackTotalPages };
    }

    const properties = propertiesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            created: data.created?.toDate?.()?.toISOString() || new Date().toISOString(),
            updated: data.updated?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Property;
    });

    return { data: properties, totalPages }
}

