const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Restoring base data...');

    // 1. Speakers
    const speakers = [
        { name: "Prof. Alan Turing", role: "Keynote Speaker", affiliation: "University of Cambridge", bio: "Pioneer of theoretical computer science.", type: "KEYNOTE", displayOrder: 1 },
        { name: "Dr. Ada Lovelace", role: "Keynote Speaker", affiliation: "Future of AI Institute", bio: "First computer programmer.", type: "KEYNOTE", displayOrder: 2 },
        { name: "Kenji Tanaka", role: "Innovation Lead", affiliation: "Robotics Global", bio: "Expert in autonomous systems.", type: "KEYNOTE", displayOrder: 3 }
    ];

    for (const s of speakers) {
        await prisma.speaker.create({ data: s });
    }

    // 2. Committee
    const committee = [
        { name: "Dr. Robert Ford", role: "General Chair" },
        { name: "Dr. Elena Fisher", role: "Program Chair" },
        { name: "Prof. John Doe", role: "Technical Chair" }
    ];

    for (const c of committee) {
        await prisma.committeeMember.create({ data: c });
    }

    // 3. Resources (Templates)
    const resources = [
        { title: "Abstract Template", category: "Template", fileUrl: "/templates/abstract.docx" },
        { title: "Presentation Guidelines", category: "Guidelines", fileUrl: "/templates/guidelines.pdf" },
        { title: "Conference Brochure", category: "Brochure", fileUrl: "/templates/brochure.pdf" }
    ];

    for (const r of resources) {
        await prisma.resource.create({ data: r });
    }

    // 4. Placeholder Award
    await prisma.award.create({
        data: { title: "Best Paper Award", category: "Academic", description: "Recognizing excellence in AI research." }
    });

    console.log('Restoration completed.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
