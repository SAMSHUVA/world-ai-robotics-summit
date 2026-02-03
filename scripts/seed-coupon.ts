import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const coupon = await (prisma as any).coupon.upsert({
            where: { code: '1' },
            update: {
                isActive: true,
                discountType: 'PERCENTAGE',
                discountValue: 10,
                validUntil: new Date('2027-01-01'),
                maxUses: 1000
            },
            create: {
                code: '1',
                discountType: 'PERCENTAGE',
                discountValue: 10,
                validUntil: new Date('2027-01-01'),
                isActive: true,
                maxUses: 1000
            }
        });
        console.log('--- COUPON CREATED/UPDATED ---');
        console.log(JSON.stringify(coupon, null, 2));
        console.log('------------------------------');
    } catch (error) {
        console.error('Error creating coupon:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
