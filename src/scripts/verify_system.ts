import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function testSubscribe() {
    console.log('Testing /api/subscribe...');
    try {
        const email = `test_sub_${Date.now()}@example.com`;
        const res = await fetch(`${BASE_URL}/api/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        console.log('✅ Subscribe API Response:', data);

        // Verify DB
        const sub = await prisma.subscriber.findUnique({ where: { email } });
        if (sub) console.log('✅ Subscriber found in DB:', sub.email);
        else console.error('❌ Subscriber NOT found in DB');

    } catch (err: any) {
        console.error('❌ Subscribe Failed:', err.message);
    }
}

async function testRegister() {
    console.log('\nTesting /api/register...');
    try {
        const email = `attendee_${Date.now()}@example.com`;
        const payload = {
            firstName: 'Test',
            lastName: 'User',
            email: email,
            org: 'Test Corp',
            role: 'Researcher',
            dietary: 'None',
            ticketType: 'Regular'
        };

        const res = await fetch(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        console.log('✅ Register API Response:', data);

        // Verify DB
        const attendee = await prisma.attendee.findFirst({ where: { email } });
        if (attendee) console.log('✅ Attendee found in DB:', attendee.email);
        else console.error('❌ Attendee NOT found in DB');

    } catch (err: any) {
        console.error('❌ Register Failed:', err.message);
    }
}

async function main() {
    console.log('--- STARTING VERIFICATION ---');
    await testSubscribe();
    await testRegister();
    // Paper submission is harder to test via script due to FormData/File object complexity in node,
    // but we can verify the other two first.
    console.log('--- VERIFICATION COMPLETE ---');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
