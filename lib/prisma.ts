import { PrismaClient } from '@prisma/client/edge'

//개발 중 HMR(핫 리로드) 시 PrismaClient 중복 생성을 방지
const globalForPrisma = global as unknown as { prisma: PrismaClient };

//실제 Prisma 인스턴스 생성
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["error", "warn"], // 필요시: ['query', 'info', 'warn', 'error']
    });

//개발 중에만 글로벌에 저장 (배포 환경은 새로 생성)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;