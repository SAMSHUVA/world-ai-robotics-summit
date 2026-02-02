const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // SEED SPEAKERS
    // Clear existing to avoid duplicates if re-run (optional, but good for dev)
    // await prisma.speaker.deleteMany({});

    const speakers = [
        { name: "Prof. Alan Turing", role: "Professor of Comp. Sci", affiliation: "Cambridge University", photoUrl: "/speaker_1.png", bio: "Pioneer of theoretical computer science." },
        { name: "Dr. Ada Lovelace", role: "Director of AI Research", affiliation: "DeepMind Institute", photoUrl: "/speaker_2.png", bio: "First computer programmer." },
        { name: "Kenji Tanaka", role: "Tech Entrepreneur", affiliation: "Future Systems Inc.", photoUrl: "/speaker_3.png", bio: "Innovator in neural interfaces." }
    ];

    for (const s of speakers) {
        await prisma.speaker.create({ data: s });
    }

    // SEED COMMITTEE
    // await prisma.committeeMember.deleteMany({});

    const committee = [
        "Dr. Robert Ford - Program Chair",
        "Dr. Elena Fisher - Technical Chair",
        "Prof. John Doe - General Chair",
        "Dr. Emily Chen - Publication Chair",
        "Prof. David Lee - Finance Chair",
        "Dr. Sarah Connor - Publicity Chair"
    ];

    for (const c of committee) {
        const [name, role] = c.split(" - ");
        await prisma.committeeMember.create({
            data: { name, role, photoUrl: "" } // Placeholder or empty for now
        });
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
