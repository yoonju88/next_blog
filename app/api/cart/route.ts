import { NextResponse, NextRequest } from "next/server";
import { auth, firestore } from "@/firebase/server"

export const runtime = "nodejs"
export const dynamic = 'force-dynamic'

export async function DELETE(req: NextRequest) {

    try {
        const authHeader = req.headers.get('Authorization');
        // 1. 유효성 검사: 'Bearer ' 전체 문자열로 확인
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: "Authentication require" }, { status: 401 })
        }
        // 2. 토큰 추출: 'Bearer ' 뒤의 공백까지 포함하여 분리
        const idToken = authHeader.split('Bearer ')[1]
        // 토큰이 없거나 너무 짧으면 오류 처리 (예외 방어)
        if (!idToken || idToken.length < 10) {
            return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 })
        }
        // 3. 토큰 검증
        const decodedToken = await auth.verifyIdToken(idToken)
        const firebaseUID = decodedToken.uid;

        //사용자 문서의 참조를 가져옵니다.
        const userRef = firestore.doc(`users/${firebaseUID}`);

        await userRef.update({
            cart: []
        });

        // Firestore에서 해당 사용자의 장바구니 컬렉션
        const cartRef = firestore.collection(`users/${firebaseUID}/cart`)

        // 장바구니 컬렉션의 모든 문서를 삭제
        const batch = firestore.batch()
        const cartItemsSnapshot = await cartRef.get()
        cartItemsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref)
        })
        await batch.commit()

        return NextResponse.json({
            success: true,
            message: "Cart has been cleared"
        })

    } catch (error: any) {
        console.error("Error clearing cart :", error)
        return NextResponse.json({
            success: false,
            message: "Failed to clear cart."
        }, {
            status: 500
        })
    }
}