import { Timestamp } from "firebase/firestore"

export type Review = {
    id: string; // 문서 ID
    profileId: string;
    propertyId: string;
    rating: number; // 1 ~ 5 같은 숫자
    comment: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}