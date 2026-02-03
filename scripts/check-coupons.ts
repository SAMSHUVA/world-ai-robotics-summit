import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const coupons = await (prisma as any).coupon.findMany();
        console.log('--- ALL COUPONS ---');
        console.log(JSON.stringify(coupons, null, 2));
        console.log('-------------------');
    } catch (error) {
        console.error('Error fetching coupons:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
