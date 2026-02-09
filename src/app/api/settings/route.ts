import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// GET /api/settings - Fetch all global settings
export async function GET() {
    try {
        const settings = await prisma.globalSetting.findMany();
        return NextResponse.json(settings);
    } catch (error) {
        console.error("GET /api/settings Error:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

// PATCH /api/settings - Update or create settings
export async function PATCH(req: NextRequest) {
    try {
        const data = await req.json(); // Expected: { [key: string]: string }

        if (!data || typeof data !== 'object') {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        // Update all fields provided in the request
        const updates = Object.entries(data).map(([key, value]: [string, any]) => {
            const stringValue = value === null || value === undefined ? '' : String(value).trim();
            return prisma.globalSetting.upsert({
                where: { key },
                update: { value: stringValue },
                create: { key, value: stringValue },
            });
        });

        if (updates.length === 0) {
            return NextResponse.json({ message: "No settings to update (all values were empty)" });
        }

        const results = await prisma.$transaction(updates as any);

        // Revalidate the homepage to reflect changes
        revalidatePath("/");

        return NextResponse.json(results);
    } catch (error) {
        console.error("PATCH /api/settings Error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
