import { firestore, getTotalPages } from "@/firebase/server";
import { Property } from "@/types/property";
import { PropertyStatus } from "@/types/propertyStatus";


type GetPropetyOptions = {
    sort?: 'newest' | 'best';
    filters?: {
        // minPrice?: number | null;
        // maxPrice?: number | null;
        category?: string | null;
        brand?: string | null;
        //search?: string;
        skinType?: string | null;
    }
    pagination?: {
        pageSize?: number;
        page?: number;
    }
}

function serializeTimestamps(obj: any): any {
    if (Array.isArray(obj)) return obj.map(serializeTimestamps);

    if (obj && typeof obj === "object") {
        const newObj: any = {};
        for (const key in obj) {
            const value = obj[key];
            if (value?.toDate instanceof Function) {
                newObj[key] = value.toDate().toISOString();
            } else if (value?._seconds !== undefined && value?._nanoseconds !== undefined) {
                newObj[key] = new Date(value._seconds * 1000).toISOString();
            } else {
                newObj[key] = serializeTimestamps(value);
            }
        }
        return newObj;
    }

    return obj;
}
export const getProperties = async (options?: GetPropetyOptions) => {
    const page = options?.pagination?.page || 1;
    const pageSize = options?.pagination?.pageSize || 10;
    const { category, brand, skinType } = options?.filters || {};
    // properties 컬렉션에 대한 쿼리 객체 생성
    // Query 타입 사용: 이후 where(), orderBy() 등의 필터/정렬 메서드 체이닝을 위함
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = firestore.collection("properties");

    // 최근 2개월 필터
    if (options?.sort === "newest") {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        query = query.where("created", ">=", twoMonthsAgo).orderBy("created", "desc");
    } else if (options?.sort === "best") {
        query = query.orderBy("soldQuantity", "desc");
    } else {
        query = query.orderBy("updated", "desc");
    }

    // 일반 필터
    if (category) query = query.where("category", "==", category);
    if (brand) query = query.where("brand", "==", brand);
    if (skinType) query = query.where("skinType", "==", skinType);

    // 총 페이지 계산
    const snapshotForCount = await query.get();
    const totalPages = Math.ceil(snapshotForCount.size / pageSize);

    // 페이지네이션
    const snapshot = await query.limit(pageSize).offset((page - 1) * pageSize).get();

    const properties: Property[] = snapshot.docs.map(doc =>
        serializeTimestamps({ id: doc.id, ...doc.data() })
    );

    return { data: properties, totalPages };
};