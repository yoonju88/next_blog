import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdminByUID(firebaseUID: string) {
    try {
        // Prisma update
        const updated = await prisma.user.update({
            where: { firebaseUID }, // UID로 특정 유저 찾기
            data: { isAdmin: true }, // isAdmin 컬럼을 true로 설정
        });

        console.log("✅ Updated user to admin:", updated);
    } catch (error) {
        console.error("❌ Failed to update user:", error);
    } finally {
        // Prisma 연결 종료
        await prisma.$disconnect();
    }
}

// 🔹 여기에 관리자 권한을 줄 Firebase UID 입력
const adminUID = "RBCBjmFGXwZngU1dIFIRZFPt3Wt1";

// 함수 호출
makeAdminByUID(adminUID);