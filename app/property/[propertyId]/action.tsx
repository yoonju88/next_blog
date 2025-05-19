"use server"
import { auth, firestore } from "@/firebase/server"
import { FieldValue } from "firebase-admin/firestore"
import { collection, addDoc, getFirestore } from "firebase/firestore";

export const addFavourite = async (proeprtyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken) {
        return {
            error: true,
            message: "Unauthorized"
        }
    }

    await firestore
        .collection("favourites")
        .doc(verifiedToken.uid)
        .set(
            {
                [proeprtyId]: true
            },
            {
                merge: true
            }
        )
}

export const removefavourite = async (propertyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken)

    if (!verifiedToken) {
        return {
            error: true,
            message: "Unauthorized"
        }
    }
    await firestore
        .collection("favourites")
        .doc(verifiedToken.uid)
        .update({
            [propertyId]: FieldValue.delete(),
        });
}

export const createReview = async (propertyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken)
    if (!verifiedToken) {
        return {
            error: true,
            message: "Unauthorized, login first to create the review"
        }
    }

}

// 리뷰 데이터 추가 함수
async function addReview(reviewerName: string, reviewText: string, rating: number) {
    try {
        // 'reviews' 컬렉션에 새 문서 추가
        const docRef = await addDoc(collection(db, "reviews"), {
            reviewer: reviewerName,
            text: reviewText,
            rating: rating,
            timestamp: new Date(), // 리뷰 작성 시간 기록
            // 필요에 따라 다른 필드를 추가할 수 있습니다.
            // 예: productId: '...' 또는 userId: '...'
        });
        console.log("리뷰 문서가 성공적으로 추가되었습니다. 문서 ID:", docRef.id);
        return docRef.id; // 추가된 문서의 ID 반환
    } catch (e) {
        console.error("리뷰 문서 추가 중 오류 발생: ", e);
        throw e; // 오류 발생 시 예외 처리
    }
}