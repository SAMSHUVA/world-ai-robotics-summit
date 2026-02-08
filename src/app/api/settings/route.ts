import { NextRequest, NextResponse } from "next/server";
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

// PATCH /api/settings - Update or create settings bulk
export async function PATCH(req: NextRequest) {
    try {
        const data = await req.json(); // Expected: { [key: string]: string }

        if (!data || typeof data !== 'object') {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        const updates = Object.entries(data).map(([key, value]) => {
            return prisma.globalSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
        });

        const results = await prisma.$transaction(updates);
        return NextResponse.json(results);
    } catch (error) {
        console.error("PATCH /api/settings Error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
