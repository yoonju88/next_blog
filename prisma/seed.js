const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.product.createMany({
        data: [
            {
                name: '샘플 상품',
                price: 10000,
                stock: 10,
                images: ['https://via.placeholder.com/300'],
            },
            {
                name: '샘플 상품2',
                price: 15000,
                stock: 5,
                images: ['https://via.placeholder.com/300'],
            },
        ],
        skipDuplicates: true,
    });
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });