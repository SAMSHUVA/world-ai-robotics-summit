import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const models = [
        'speaker',
        'committeeMember',
        'paperSubmission',
        'attendee',
        'conferenceInquiry',
        'resource',
        'contactMessage',
        'subscriber',
        'resourceLead'
    ];

    console.log('--- DATABASE DIAGNOSTIC ---');
    for (const model of models) {
        try {
            const count = await (prisma as any)[model].count();
            console.log(`${model}: ${count}`);
        } catch (e: any) {
            console.error(`Error counting ${model}: ${e.message}`);
        }
    }
    console.log('---------------------------');
}

main().finally(() => prisma.$disconnect());
