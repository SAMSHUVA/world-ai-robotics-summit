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

// PATCH /api/settings - Update or create settings (preserve existing values if empty)
export async function PATCH(req: NextRequest) {
    try {
        const data = await req.json(); // Expected: { [key: string]: string }

        if (!data || typeof data !== 'object') {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        // First, fetch existing settings
        const existingSettings = await prisma.globalSetting.findMany();
        const existingMap = existingSettings.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        // Only update fields that have non-empty values in the request
        const updates = Object.entries(data).map(([key, value]: [string, any]) => {
            // Only update if the new value is not empty
            if (value && String(value).trim() !== '') {
                return prisma.globalSetting.upsert({
                    where: { key },
                    update: { value: String(value).trim() },
                    create: { key, value: String(value).trim() },
                });
            }
            // If value is empty, skip this update (preserve existing)
            return null;
        }).filter(Boolean);

        if (updates.length === 0) {
            return NextResponse.json({ message: "No settings to update (all values were empty)", settings: existingSettings });
        }

        const results = await prisma.$transaction(updates as any);
        return NextResponse.json(results);
    } catch (error) {
        console.error("PATCH /api/settings Error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
